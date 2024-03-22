const {
    Sparky,
    isPublic
} = require("../lib/plugins.js");
const { elevenlabs
} = require('../lib/functions.js');

const { 
	MusicFind
} = require('../lib/sub.js');
const axios = require('axios');


Sparky(
    {
        name: "vo",
        fromMe: true,
        category: "tools",
        desc: "Resends the view Once message"
    },
    async ({
        m, client 
    }) => {
try {
        if (!m.quoted) {
            return m.reply("_Reply to ViewOnce Message !_");
        }
     if (m.quoted.message.viewOnceMessageV2) {
            let vv = m.quoted.message.viewOnceMessageV2

            if (vv.message.imageMessage) {
                let img = await m.downloadAndSaveMedia(vv.message.imageMessage, "vo", true)

                await client.sendMessage(m.jid, {
                    image: {
                        url: img
                    }, caption: vv.message.imageMessage.caption
                }, {
                    quoted: m
                })
            } else if (vv.message.videoMessage) {

                let video = await m.downloadAndSaveMedia(vv.message.videoMessage, "vo", true)

                await client.sendMessage(m.jid, {
                    video: {
                        url: video
                    }, caption: vv.message.videoMessage.caption
                }, {
                    quoted: m
                })

            }
        } else if (m.quoted.message.viewOnceMessageV2Extension.message.audioMessage) {
              let audio = await m.downloadAndSaveMedia(m.quoted.message.viewOnceMessageV2Extension.message.audioMessage, "vo", true)

                await client.sendMessage(m.jid, {
                    audio: {
                        url: audio
                    }
                }, {
                    quoted: m
                })
     } else {
            m.reply('_Not a ViewOnce Message !_')
        }
} catch {
  m.reply("_Error !_")
}
    })


Sparky(
    {
        name: "find",
        fromMe: isPublic,
        category: "tools",
        desc: "Finds music from replied Audio",
    },
    async ({
        m, client
    }) => {
            if (!m.quoted || !(m.quoted.message.audioMessage || m.quoted.message.videoMessage)) {
                return m.reply("_Reply to Audio/Video Message !_");
            }
		let msg = await m.sendMsg(m.jid, "*_Please wait..._*",{quoted:m});
try {
	    return await MusicFind(m, client);
                    } catch (e) {
            await m.sendMsg(m.jid,"_*No result found!*_",{edit:msg.key});
        }
    })

Sparky(
    {
        name: "ss",
        fromMe: isPublic,
        category: "tools",
        desc: "Finds music from replied Audio",
    },
    async ({
        m, client, args
    }) => {
args = args || m.quoted?.text;
if (!args) return await m.reply("_Enter Or Reply to a link_");
let dll = `https://toxicdevilapi.vercel.app/other/screenshot?url=${args}`
client.sendMessage(m.jid, { image :{ url: dll }, caption: "_X BOT MD V3_"}, {quoted: m })
    }
	);

Sparky(
    {
        name: "save",
        fromMe: true,
        category: "tools",
        desc: "Finds music from replied Audio",
    },
    async ({
        m, client, args
    }) => {
if (!m.quoted) {
        return m.adreply("_Reply to Anyone's Status!_");
}
let res = await m.quoted.download();
      if(m.quoted.message.videoMessage){
       await client.sendMessage(m.jid, { video :res ,  mimetype:"video/mp4"}, {quoted: m })
      } else if(m.quoted.message.imageMessage){
      await client.sendMessage(m.jid, { image :res ,  mimetype:"image/jpeg"}, {quoted: m })
      }
    }
	);
