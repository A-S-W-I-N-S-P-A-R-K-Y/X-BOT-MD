const {
    getContentType,
    downloadContentFromMessage,
    generateWAMessageFromContent,
    jidDecode,
    proto
} = require('@whiskeysockets/baileys');
const {
  BOT_INFO,
  URL
} = require("../config.js");

const {
    fromBuffer
} = require('file-type');
const fs = require('fs');
const fetch = require('node-fetch');
const {
    HANDLERS
} = require("../config.js");
const {
  writeExifImg,
  writeExifVid,
  writeExifWebp,
  imageToWebp,
  videoToWebp,
  toAudio
} = require("./functions.js");
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const isUrl = (url) => {
        return new RegExp(
            /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/,
            "gi"
        ).test(url);
    }
const decodeJid = (jid) => {
    if (!jid) return jid;
    if (/:\d+@/gi.test(jid)) {
        const decode = jidDecode(jid) || {};
        return decode.user && decode.server
        ? `${decode.user}@${decode.server}`: jid;
    } else {
        return jid;
    }
};
const downloadMedia = (message, pathFile) =>
new Promise(async (resolve, reject) => {
    let type = Object.keys(message)[0];
    let mimeMap = {
        imageMessage: "image",
        videoMessage: "video",
        stickerMessage: "sticker",
        documentMessage: "document",
        audioMessage: "audio",
    };
    let mes = message;
    if (type == "templateMessage") {
        mes = message.templateMessage.hydratedFourRowTemplate;
        type = Object.keys(mes)[0];
    }
    if (type == "buttonsMessage") {
        mes = message.buttonsMessage;
        type = Object.keys(mes)[0];
    }
    try {
        if (pathFile) {
            const stream = await downloadContentFromMessage(
                mes[type],
                mimeMap[type]
            );
            let buffer = Buffer.from([]);
            for await (const chunk of stream) {
                buffer = Buffer.concat([buffer, chunk]);
            }
            await fs.promises.writeFile(pathFile, buffer);
            resolve(pathFile);
        } else {
            const stream = await downloadContentFromMessage(
                mes[type],
                mimeMap[type]
            );
            let buffer = Buffer.from([]);
            for await (const chunk of stream) {
                buffer = Buffer.concat([buffer, chunk]);
            }
            resolve(buffer);
        }
    } catch (e) {
        reject(e);
    }
});

const isadmin =  async (jid, user, client) => {
        const groupMetadata = await client.groupMetadata(jid);
        const groupAdmins = groupMetadata.participants
        .filter((participant) => participant.admin !== null)
        .map((participant) => participant.id);
        return groupAdmins.includes(decodeJid(user));
}

function serialize(m, client) {
    
    if (m.key) {
      
        m.id = m.key.id;
        m.isSelf = m.key.fromMe;
        m.jid = m.key.remoteJid;
        m.isGroup = m.jid.endsWith("@g.us");
	m.user = decodeJid(client.user.id);
        m.sender = m.isGroup
        ? m.key.participant: m.isSelf
        ? client.user.id: m.jid;
        m.isBotAdmin = isadmin(m.jid, client.user.id,  client)
        m.isAdmin = isadmin(m.jid, m.sender, client)
      
    }
    if (m.message) {
        m.type = getContentType(m.message);
        if (m.type === "ephemeralMessage") {
            m.message = m.message[m.type].message;
            const tipe = Object.keys(m.message)[0];
            m.type = tipe;
            if (tipe === "viewOnceMessage") {
                m.message = m.message[m.type].message;
                m.type = getContentType(m.message);
            }
        }
        if (m.type === "viewOnceMessage") {
            m.message = m.message[m.type].message;
            m.type = getContentType(m.message);
        }

        try {
            m.mentions = m.message[m.type].contextInfo
            ? m.message[m.type].contextInfo.mentionedJid || []: [];
        } catch {
            m.mentions = false;
        }
        try {
            const quoted = m.message[m.type].contextInfo;
            let type;
            if (quoted && quoted.quotedMessage) {
                if (quoted.quotedMessage["ephemeralMessage"]) {
                    type = Object.keys(quoted.quotedMessage.ephemeralMessage.message)[0];
         m.quoted = {
                        type: type === "viewOnceMessage" ? "view_once": "ephemeral",
                        stanzaId: quoted.stanzaId,
                        sender: quoted.participant,
                        message:
                        type === "viewOnceMessage"
                        ? quoted.quotedMessage.ephemeralMessage.message.viewOnceMessage
                        .message: quoted.quotedMessage.ephemeralMessage.message,
                    };
                } else if (quoted.quotedMessage["viewOnceMessage"]) {
                    m.quoted = {
                        type: "view_once",
                        stanzaId: quoted.stanzaId,
                        sender: quoted.participant,
                        message: quoted.quotedMessage.viewOnceMessage.message,
                    };
                } else {
                    m.quoted = {
                        type: "normal",
                        stanzaId: quoted.stanzaId,
                        sender: quoted.participant,
                        message: quoted.quotedMessage,
                    };
                }

                m.quoted.isSelf = m.quoted.sender === client.user.id;
                m.quoted.mtype = Object.keys(m.quoted.message);

                m.quoted.text =
                m.quoted.message[m.quoted.mtype]?.text ||
                m.quoted.message[m.quoted.mtype]?.description ||
                m.quoted.message[m.quoted.mtype]?.caption ||
                (m.quoted.mtype === "templateButtonReplyMessage" &&
                    m.quoted.message[m.quoted.mtype].hydratedTemplate
                    ?.hydratedContentText) ||
                m.quoted.message[m.quoted.mtype] ||
                "";
                m.quoted.key = {
                    id: m.quoted.stanzaId,
                    fromMe: m.quoted.isSelf,
                    remoteJid: m.jid,
                };
                m.quoted.download = (pathFile) =>
                downloadMedia(m.quoted.message, pathFile);
            }
        } catch {
            m.quoted = null;
        }

        try {
          m.text =
            m.message.conversation ||
            m.message[m.type].text ||
	    m.message[m.type].selectedId
          
            m.body =
            m.message.conversation ||
            m.message[m.type].text ||
            m.message[m.type].caption ||
            (m.type === "listResponseMessage" &&
                m.message[m.type].singleSelectReply.selectedRowId) ||
            (m.type === "buttonsResponseMessage" &&
                m.message[m.type].selectedButtonId &&
                m.message[m.type].selectedButtonId) ||
            (m.type === "templateButtonReplyMessage" &&
                m.message[m.type].selectedId) ||
            false;
        } catch {
            m.body = false;
        }
        /**
        *
        * @param {*} jid
        * @param {*} path
        * @param {*} quoted
        * @param {*} options
        * @returns
        */
        m.reply = async (txt) => {
            //client.sendPresenceUpdate('composing' ,m.key.remoteJid )
            client.sendMessage(m.jid, {
                text: txt
            }, {
                quoted: m
            })
        }
        m.send = async (jid, txt) => {
            //client.sendPresenceUpdate('composing' ,m.key.remoteJid )
            client.sendMessage(jid, {
                text: txt
            })
        }

        m.error = async (txt) => {
           let error =  client.sendMessage(m.jid, {
                text: `${txt}`
            }, {
                quoted: m
            })
          await sleep(2000)
          return client.sendMessage(m.jid , {
                text : "ᴛʀʏ ᴀɢᴀɪɴ ʟᴀᴛᴇʀ!!" ,
                edit : error.key
          } , { 
                quoted : m 
          })
        }

      
        m.downloadAndSaveMedia = async (m, filename, attachExtension = true) => {
        let quoted = m.message ? m.message : m
        let mime = (m.message || m).mimetype || ''
        let messageType = m.mtype ? m.mtype.replace(/Message/gi, '') : mime.split('/')[0]
        const stream = await downloadContentFromMessage(quoted, messageType)
        let buffer = Buffer.from([])
        for await(const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk])
        }
	let type = await fromBuffer(buffer)
        let trueFileName = attachExtension ? (filename + '.' + type.ext) : filename
        await fs.writeFileSync(trueFileName, buffer)
        return trueFileName
    }

      /////////////////////////
      let sperky = { "key": { "participants":"0@s.whatsapp.net", "remoteJid": "status@broadcast", "fromMe": false, "id": "Halo" }, "message": { "contactMessage": { "displayName": "X BOT MD V3","vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=917012984396:917012984396\nitem1.X-ABLabel:Ponsel\nEND:VCARD` }}, "participant": "0@s.whatsapp.net" }
      
m.adreply = async (teks) => {                                           
            client.sendMessage(m.jid, { text: teks, contextInfo: { externalAdReply: {

title: BOT_INFO.split(";")[0],
                                                                  
body: BOT_INFO.split(";")[1],

sourceUrl: URL,

mediaUrl: URL,

mediaType: 1,

showAdAttribution: true,

renderLargerThumbnail: false,

thumbnailUrl: BOT_INFO.split(";")[2] }}}, { quoted : sperky });
  }
      /////////////////////////
client.sendPresenceUpdate('unavailable', m.user)
/////////////
m.runtime = async () => {
          seconds = Number(`${process.uptime()}`);
          var d = Math.floor(seconds / (3600 * 24));
          var h = Math.floor(seconds % (3600 * 24) / 3600);
          var m = Math.floor(seconds % 3600 / 60);
          var s = Math.floor(seconds % 60);
          var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
          var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
          var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
          var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
          return dDisplay + hDisplay + mDisplay + sDisplay;
        }

 m.uptime = async () => {
        const duration = process.uptime();
        const seconds = Math.floor(duration % 60);
        const minutes = Math.floor((duration / 60) % 60);
        const hours = Math.floor((duration / (60 * 60)) % 24);

        const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

        return formattedTime;
    }

m.forward = async(jid, message, options = {}) => {
    let opt = generateWAMessageFromContent(jid, message, {
      ...options,
      userJid: client.user.id,
    });
  let msg = {
          viewOnceMessage: {
            message: {
              ...opt.message,
            },
          },
        };
    await client.relayMessage(jid, msg, {
      messageId: opt.key.id,
      ...options,
    });
    return msg;
}

/*m.sendFromUrl = async(url, options = {}) => {
          let buff = await getBuffer(url);
          let mime = await fileType.fromBuffer(buff);
          let type = mime.mime.split("/")[0];
          if (type === "audio") {
              options.mimetype = "audio/mpeg";
          }
          if (type === "application") type = "document";
          return this.client.sendMessage(
              this.jid,
              {
                  [type]: buff, ...options
              },
              {
                  ...options
              }
          );
      }*/
m.getFile = async(PATH, returnAsFilename) => {
    let res,
    filename;
    let data = Buffer.isBuffer(PATH)
    ? PATH: /^data:.*?\/.*?;base64,/i.test(PATH)
    ? Buffer.from(PATH.split`,`[1], "base64"): /^https?:\/\//.test(PATH)
    ? await (res = await fetch(PATH)).buffer(): fs.existsSync(PATH)
    ? ((filename = PATH), fs.readFileSync(PATH)): typeof PATH === "string"
    ? PATH: Buffer.alloc(0);
    if (!Buffer.isBuffer(data)) throw console.log("Result is not a buffer");
    let type = (await fromBuffer(data)) || {
        mime: "application/octet-stream",
        ext: ".bin",
    };
    if (data && returnAsFilename && !filename)
        (filename = path.join(
        __dirname,
        "../" + new Date() * 1 + "." + type.ext
    )),
    await fs.promises.writeFile(filename, data);
    return {
        res,
        filename,
        ...type,
        data,
    };
};	    
            
m.sendMsg = async(jid, content, opt = {
    packname: "Viper"
}, type = "text") => {
    {
        switch (type.toLowerCase()) {
			
            case "text": {
                return client.sendMessage(jid, {
                    text: content, ...opt,
                }, {
                    ...opt
                });
            } break;
			
            case "image": {
                if (Buffer.isBuffer(content)) {
                    return client.sendMessage(jid, {
                        image: content, ...opt
                    }, {
                        ...opt
                    });
                } else if (isUrl(content)) {
                    let media = await (await fetch(content)).buffer()
                    return client.sendMessage(jid,
                        {
                            image: media, ...opt
                        }, {
                            ...opt
                        });
                }
            } break;

	    case "video": {
                if (Buffer.isBuffer(content)) {
                    return client.sendMessage(jid, {
                        video: content, ...opt
                    }, {
                        ...opt
                    });
                } else if (isUrl(content)) {
                    let media = await (await fetch(content)).buffer()
                    return client.sendMessage(jid,
                        {
                            video: media, ...opt
                        }, {
                            ...opt
                        });
                }
            } break;
			
	    case "audio": {
                if (Buffer.isBuffer(content)) {
                    return client.sendMessage(jid, {
                        audio: content, ...opt
                    }, {
                        ...opt
                    });
                } else if (isUrl(content)) {
                    let media = await (await fetch(content)).buffer()
                    return client.sendMessage(jid,
                        {
                            audio: media, ...opt
                        }, {
                            ...opt
                        });
                }
            } break;
			
            case "sticker": {
                let {
                    data,
                    mime
                } = await m.getFile(content);
                if (mime == "image/webp") {
                    let buff = await writeExifWebp(data, opt);
                    await client.sendMessage(
                        jid,
                        {
                            sticker: {
                                url: buff
                            }, ...opt
                        },
                        opt
                    );
                } else {
                    mime = await mime.split("/")[0];

                    if (mime === "video") {
                        await client.sendImageAsSticker(jid, content, opt);
                    } else if (mime === "image") {
                        await client.sendImageAsSticker(jid, content, opt);
                    }
                }

            } break;
			
        }
    }
}
      
m.react = async (txt) => {
  await client.sendMessage(m.jid, { react: { text: txt, key: m.key } } )
}

      m.sendPoll = (jid, name = '', values = [], selectableCount = 1) => { return client.sendMessage(jid, { poll: { name, values }}) } 

m.poll = async (jid, text, list) => {
client.relayMessage(jid, {
"pollCreationMessage": {
"name": text,
"options": list.map(v => { return { optionName: v } }),
"selectableOptionsCount": list.length
}
}, {})
}
      

    }
    return m;
}
module.exports = {
  serialize
           }
