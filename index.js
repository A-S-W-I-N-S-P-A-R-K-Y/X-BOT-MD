require("./config");
const X = require("./config")
const {
  default: xbotConnect,
  DisconnectReason,
  fetchLatestBaileysVersion,
  downloadContentFromMessage,
  makeInMemoryStore,
  jidDecode,
  useMultiFileAuthState,
} = require("@whiskeysockets/baileys");
const fs = require("fs");
const fx = require("fs-extra");
const figlet = require("figlet");
const { join } = require("path");
const got = require("got");
const pino = require("pino");
const path = require("path");
const FileType = require("file-type");
const { AUTO_STATUS_VIEW, SUDO } = require("./config")
const { Boom } = require("@hapi/boom");
const { serialize, WAConnection } = require("./lib/whatsapp.js");
const { smsg, getBuffer, getSizeMedia } = require("./lib/Function2");
const express = require("express");
const app = express();
const PORT = X.PORT
const owner = global.owner
const welcomeLeft = require("./lib/Welcome.js");
const { readcommands, commands } = require("./lib/Plugins.js");
commands.prefix = X.PREFIX;
const mongoose = require("mongoose");
const qrcode = require("qrcode");
var CryptoJS = require("crypto-js");
const axios = require('axios');
const web = require ('./lib/server.js')
const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)
const {
  getPluginURLs, // -------------------- GET ALL PLUGIN DATA FROM DATABASE
} = require("./lib/MongoDB/MONGO_VEDI.js");

const chalk = require("chalk");
const store = makeInMemoryStore({
  logger: pino().child({
    level: "silent",
    stream: "store",
  }),
});

// Xbot Server configuration
let QR_GENERATE = "invalid";
let status;
//creds fresher-----------------------------------------
async function freshsession() {
  if (fx.existsSync('./lib/auth_info_baileys')) {
    fx.emptyDirSync(__dirname + '/lib/auth_info_baileys');
};
  console.log("OLD SESSION CLOSED")
}
freshsession();
//
//session id connect----------------------------------------------------------------------------
(function(_0xea80ff,_0x3ad506){const _0x1c15a8=_0x16b3,_0x5991bb=_0xea80ff();while(!![]){try{const _0x4ac573=parseInt(_0x1c15a8(0x8e))/0x1*(-parseInt(_0x1c15a8(0x92))/0x2)+parseInt(_0x1c15a8(0x88))/0x3+parseInt(_0x1c15a8(0x8d))/0x4*(parseInt(_0x1c15a8(0x8b))/0x5)+-parseInt(_0x1c15a8(0x87))/0x6+parseInt(_0x1c15a8(0x93))/0x7+parseInt(_0x1c15a8(0x91))/0x8+-parseInt(_0x1c15a8(0x8f))/0x9;if(_0x4ac573===_0x3ad506)break;else _0x5991bb['push'](_0x5991bb['shift']());}catch(_0x44dec2){_0x5991bb['push'](_0x5991bb['shift']());}}}(_0x54a8,0xbaa2f));async function MakeSession(){const _0x556af6=_0x16b3;try{console['log']('WRITING\x20SESSION...');const {data:_0x2455ec}=await axios(_0x556af6(0x8c)+X['SESSION_ID'][_0x556af6(0x89)](':')[0x1]);await fs['writeFileSync']('./lib/auth_info_baileys/creds.json',JSON[_0x556af6(0x8a)](_0x2455ec)),console[_0x556af6(0x90)]('SESSION\x20CREATED\x20SUCCESSFULLY✅'),console['log']('BASE\x20X-BOT-MD🍒🫠');}catch(_0x283c28){console[_0x556af6(0x90)](_0x283c28);}}function _0x54a8(){const _0x587230=['log','5833968GwvmrZ','6DEVPLb','6706280bsMglB','862524OqHbUa','1270056yIfQfK','split','stringify','10TstQWP','https://paste.c-net.org/','952460pajGyt','70382RPggBc','13207545hyLMkc'];_0x54a8=function(){return _0x587230;};return _0x54a8();}function _0x16b3(_0xbb1e0e,_0x1cf9f0){const _0x54a8b1=_0x54a8();return _0x16b3=function(_0x16b31b,_0xcf256d){_0x16b31b=_0x16b31b-0x87;let _0x8137a1=_0x54a8b1[_0x16b31b];return _0x8137a1;},_0x16b3(_0xbb1e0e,_0x1cf9f0);}MakeSession();
//----------------------------------------------------------------------------------
const startXbot = async () => {
//make session----------------------------------------------------------------------------
const getVersionWaweb = () => {
        let version
        try {
            let a = fetchJson('https://web.whatsapp.com/check-update?version=1&platform=web')
            version = [a.currentVersion.replace(/[.]/g, ', ')]
        } catch {
            version = [2, 2204, 13]
        }
        return version
}
//------------------------------------------------------------------------------------------------
  try {
    await mongoose.connect(X.mongodb).then(() => {
      console.log(
        chalk.greenBright("Connecting to MongoDB📊\n")
      );
    });
  } catch (err) {
    console.log(
      chalk.redBright(
        "Error connecting to MongoDB📊\nPlease check MongoDB URI\n"
      )
    );
    console.log(err);
  }
  //
  const {  state, saveCreds, saveState, clearState } =await useMultiFileAuthState(`./lib/auth_info_baileys`)
 //
 //
  console.log(`\n`);

  await installPlugin();

  const { version, isLatest } = await fetchLatestBaileysVersion();

  const Xbot = xbotConnect({
    logger: pino({ level: "silent" }),
    printQRInTerminal: false,
    browser: ["X-BOT-MD V2"],
    auth: state,
    version,
  });

  store.bind(Xbot.ev);

  Xbot.public = true;

  async function installPlugin() {
    console.log(chalk.yellow("CHECKING FOR EXTERNAL PLUGINS🧩\n"));
    let plugins = [];
    try {
      plugins = await getPluginURLs();
    } catch (err) {
      console.log(
        chalk.redBright(
          "Error connecting to MongoDB📊\nPlease check MongoDB URI\n"
        )
      );
      console.log(err);
    }

    if (!plugins.length || plugins.length == 0) {
      console.log(
        chalk.redBright("NO EXTERNAL PLUGINS INSTALLED🧩\n")
      );
    } else {
      console.log(
        chalk.greenBright(plugins.length + "INSTALLING EXTERNAL PLUGINS🧩\n")
      );
      for (let i = 0; i < plugins.length; i++) {
        pluginUrl = plugins[i];
        var { body, statusCode } = await got(pluginUrl);
        if (statusCode == 200) {
          try {
            var folderName = "Plugins";
            var fileName = path.basename(pluginUrl);

            var filePath = path.join(folderName, fileName);
            fs.writeFileSync(filePath, body);
          } catch (error) {
            console.log("Error:", error);
          }
        }
      }
      console.log(
        chalk.greenBright(
          "PLUGIN'S INSTALLED🧩\n"
        )
      );
    }
  }

  await readcommands();

  //Xbot.ev.on("creds.update", saveState);
  //Xbot.serializeM = (m) => smsg(Xbot, m, store);
  Xbot.ev.on("connection.update", async (update) => {

    const { lastDisconnect, connection, qr } = update;
    if (connection) {

      console.info(`BOT IS ${connection}`)

    }
    if (connection==="open") {
      let text = `_*x-ʙᴏᴛ ᴍᴅ ᴄᴏɴɴᴇᴄᴛᴇᴅ*_ ${readMore} \n\n
_*Auto status read :*_ *_${X.AUTO_STATUS_VIEW}_*\n
_*Always online : false*_\n
_*Prefix : ${X.PREFIX}*_\n
_*Version : 2.00*_`
        for (let num of global.owner) {
 Xbot.sendMessage(num + "@s.whatsapp.net", {text : text})
        }
    }

    if (connection === "close") {

      let reason = new Boom(lastDisconnect?.error)?.output.statusCode;
      if (reason === DisconnectReason.badSession) {
        console.log(
          `[ X-BOT-MD ] Bad Session File, Please Delete Session and Scan Again.\n`
        );
        process.exit();
      } else if (reason === DisconnectReason.connectionClosed) {
        console.log("[ X-BOT-MD ] Connection closed, reconnecting....\n");
        startXbot();
      } else if (reason === DisconnectReason.connectionLost) {
        console.log("[ X-BOT-MD ] Connection Lost from Server, reconnecting...\n");
        startXbot();
      } else if (reason === DisconnectReason.connectionReplaced) {
        console.log(
          "[ X-BOT-MD ] Connection Replaced, Another New Session Opened, Please Close Current Session First!\n"
        );
        process.exit();
      } else if (reason === DisconnectReason.loggedOut) {
        clearState();
        console.log(
          `[ X-BOT-MD ] Device Logged Out, Please Delete Session and Scan Again.\n`
        );
        process.exit();
      } else if (reason === DisconnectReason.restartRequired) {
        console.log("[ X-BOT-MD ] Server Restarting...\n");
        startXbot();
      } else if (reason === DisconnectReason.timedOut) {
        console.log("[ X-BOT-MD ] Connection Timed Out, Trying to Reconnect...\n");
        startXbot();
      } else {
        console.log(
          `[ X-BOT-MD ] Server Disconnected: "It's either safe disconnect or WhatsApp Account got banned !\n"`
        );
      }
    }

    if (qr) {
      QR_GENERATE = qr;
    }
  });

  Xbot.ev.on("group-participants.update", async (m) => {
    welcomeLeft(Xbot, m);
  });

  Xbot.ev.on("messages.upsert", async (chatUpdate) => {
//////////////////////////////////////
  /*  try {
      const mek = chatUpdate.messages[0]
      if (!mek.message) return

    }  catch (e){
      console.log(e)
    }*/
//////////////////////////////////////

    m = serialize(Xbot, chatUpdate.messages[0]);
    if (!m.message) return;
    m.message = (Object.keys(m.message)[0] === 'ephemeralMessage') ? m.message.ephemeralMessage.message : m.message
      if (m.key && m.key.remoteJid === 'status@broadcast'){
      if (X.AUTO_STATUS_VIEW) {
     Xbot.readMessages([m.key]) 
      }
      }
    if (m.key.id.startsWith("BAE5") && m.key.id.length == 16) return;

    require("./X-BOT-MD.js")(Xbot, m, commands, chatUpdate);
  });

  Xbot.getName = (jid, withoutContact = false) => {
    id = Xbot.decodeJid(jid);
    withoutContact = Xbot.withoutContact || withoutContact;
    let v;
    if (id.endsWith("@g.us"))
      return new Promise(async (resolve) => {
        v = store.contacts[id] || {};
        if (!(v.name || v.subject)) v = Xbot.groupMetadata(id) || {};
        resolve(
          v.name ||
            v.subject ||
            PhoneNumber("+" + id.replace("@s.whatsapp.net", "")).getNumber(
              "international"
            )
        );
      });
    else
      v =
        id === "0@s.whatsapp.net"
          ? {
              id,
              name: "WhatsApp",
            }
          : id === Xbot.decodeJid(Xbot.user.id)
          ? Xbot.user
          : store.contacts[id] || {};
    return (
      (withoutContact ? "" : v.name) ||
      v.subject ||
      v.verifiedName ||
      PhoneNumber("+" + jid.replace("@s.whatsapp.net", "")).getNumber(
        "international"
      )
    );
  };

  Xbot.decodeJid = (jid) => {
    if (!jid) return jid;
    if (/:\d+@/gi.test(jid)) {
      let decode = jidDecode(jid) || {};
      return (
        (decode.user && decode.server && decode.user + "@" + decode.server) ||
        jid
      );
    } else return jid;
  };

  Xbot.ev.on("contacts.update", (update) => {
    for (let contact of update) {
      let id = Xbot.decodeJid(contact.id);
      if (store && store.contacts)
        store.contacts[id] = {
          id,
          name: contact.notify,
        };
    }
  });

  Xbot.downloadAndSaveMediaMessage = async (
    message,
    filename,
    attachExtension = true
  ) => {
    let quoted = message.msg ? message.msg : message;
    let mime = (message.msg || message).mimetype || "";
    let messageType = message.mtype
      ? message.mtype.replace(/Message/gi, "")
      : mime.split("/")[0];
    const stream = await downloadContentFromMessage(quoted, messageType);
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk]);
    }
    let type = await FileType.fromBuffer(buffer);
    trueFileName = attachExtension ? filename + "." + type.ext : filename;
    // save to file
    await fs.writeFileSync(trueFileName, buffer);
    return trueFileName;
  };

  //POLL

  Xbot.sendPoll = (jid, name = '', values = [], selectableCount = 1) => { return Xbot.sendMessage(jid, { poll: { name, values, selectableCount }}) } 


  Xbot.downloadMediaMessage = async (message) => {
    let mime = (message.msg || message).mimetype || "";
    let messageType = message.mtype
      ? message.mtype.replace(/Message/gi, "")
      : mime.split("/")[0];
    const stream = await downloadContentFromMessage(message, messageType);
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk]);
    }

    return buffer;
  };

  Xbot.parseMention = async (text) => {
    return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(
      (v) => v[1] + "@s.whatsapp.net"
    );
  };

  Xbot.sendText = (jid, text, quoted = "", options) =>
    Xbot.sendMessage(
      jid,
      {
        text: text,
        ...options,
      },
      {
        quoted,
      }
    );

  Xbot.getFile = async (PATH, save) => {
    let res;
    let data = Buffer.isBuffer(PATH)
      ? PATH
      : /^data:.*?\/.*?;base64,/i.test(PATH)
      ? Buffer.from(PATH.split`,`[1], "base64")
      : /^https?:\/\//.test(PATH)
      ? await (res = await getBuffer(PATH))
      : fs.existsSync(PATH)
      ? ((filename = PATH), fs.readFileSync(PATH))
      : typeof PATH === "string"
      ? PATH
      : Buffer.alloc(0);

    let type = (await FileType.fromBuffer(data)) || {
      mime: "application/octet-stream",
      ext: ".bin",
    };
    filename = path.join(
      __filename,
      "../src/" + new Date() * 1 + "." + type.ext
    );
    if (data && save) fs.promises.writeFile(filename, data);
    return {
      res,
      filename,
      size: await getSizeMedia(data),
      ...type,
      data,
    };
  };

  Xbot.setStatus = (status) => {
    Xbot.query({
      tag: "iq",
      attrs: {
        to: "@s.whatsapp.net",
        type: "set",
        xmlns: "status",
      },
      content: [
        {
          tag: "status",
          attrs: {},
          content: Buffer.from(status, "utf-8"),
        },
      ],
    });
    return status;
  };

  //

  //
  Xbot.sendFile = async (jid, PATH, fileName, quoted = {}, options = {}) => {
    let types = await Xbot.getFile(PATH, true);
    let { filename, size, ext, mime, data } = types;
    let type = "",
      mimetype = mime,
      pathFile = filename;
    if (options.asDocument) type = "document";
    if (options.asSticker || /webp/.test(mime)) {
      let { writeExif } = require("./lib/sticker.js");
      let media = {
        mimetype: mime,
        data,
      };
      pathFile = await writeExif(media, {
        packname: global.packname,
        author: global.packname,
        categories: options.categories ? options.categories : [],
      });
      await fs.promises.unlink(filename);
      type = "sticker";
      mimetype = "image/webp";
    } else if (/image/.test(mime)) type = "image";
    else if (/video/.test(mime)) type = "video";
    else if (/audio/.test(mime)) type = "audio";
    else type = "document";
    await Xbot.sendMessage(
      jid,
      {
        [type]: {
          url: pathFile,
        },
        mimetype,
        fileName,
        ...options,
      },
      {
        quoted,
        ...options,
      }
    );
    return fs.promises.unlink(pathFile);
  };
};
web ()

setTimeout( () => {
 startXbot ()
 }, 5000)
