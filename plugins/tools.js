const {
    Sparky,
    isPublic
} = require("../lib/plugins.js");
const { 
	MusicFind
} = require('../lib/sub.js');
const axios = require('axios');
const acrcloud = require('acrcloud');
const acr = new acrcloud({
    host: 'identify-eu-west-1.acrcloud.com',
    access_key: 'ff489a0160188cf5f0750eaf486eee74',
    access_secret: 'ytu3AdkCu7fkRVuENhXxs9jsOW4YJtDXimAWMpJp'
});
const fs = require('fs')
const {
    tmpdir
} = require("os");
const {
    toVideo,
    imgurUpload
} = require("../lib/functions.js");
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));


Sparky(
    {
        name: "url",
        fromMe: true,
        category: "tools",
        desc: "upload media to imgur and returns Url"
    },
    async ({
        m, client, args
    }) => {

        if (!m.quoted) {
            return m.reply('Reply to an Image/Video/Audio');
        }

        let buff = await m.quoted.download()

        if (buff.length > 10 * 1024 * 1024)
            return m.reply('Reply with Filesize under 10 MegaBytes');

        let loading = await m.sendMsg(m.jid, "Uploading...")

        let {
            data,
            mime
        } = await m.getFile(buff);

        const size = (data.length / (1024 * 1024)).toFixed(2);

        let tmpInput;

        if (mime.includes('audio')) {
            const aud = await toVideo(buff);
            const tmpInput = `${tmpdir()}/imgur.mp4`
            fs.writeFileSync(tmpInput, aud)
        } else {
            tmpInput = `${tmpdir()}/imgur.${mime.split("/")[1]}`
            fs.writeFileSync(tmpInput, data)
        }
        
        await sleep(2000)

        try {
            const link = await imgurUpload(tmpInput);
            m.sendMsg(m.jid, `Url: ${link}\nSize: ${size}`, {
                edit: loading.key
            })
        } catch {
            m.sendMsg(m.jid, `Error`, {
                edit: loading.key
            })
        }

    })

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
    /*
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
    */
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
    
    Sparky(
        {
            name: "forward",
            fromMe: true,
            category: "tools",
            desc: "Finds music from replied Audio",
        },
        async ({
            m, client, args
        }) => {
    return await m.forward(args || m.jid, m.quoted.message)
        }
        );
    
    Sparky(
            {
                name: "allplugin",
                fromMe: true,
                desc: "",
                category: "sudo",
            },
            async ({client, m, args}) => {
                try{
         const {
                  data
                } = await axios(`https://x-bot-md-qr.vercel.app/allplug.js`);
        return await m.adreply(data)
                } catch (e) {
                    console.log(e)
                }
            });
