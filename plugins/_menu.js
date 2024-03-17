const {
    Sparky,
    commands,
    isPublic
} = require("../lib/plugins.js");
const plugins = require("../lib/plugins.js");
const {
    OWNER_NAME,
    BOT_NAME,
    HANDLERS,
    WORK_TYPE,
    BOT_INFO
} = require("../config.js");
const font = require("@viper-x/fancytext");
const fs = require("fs");
const more = String.fromCharCode(8206);
const readMore = more.repeat(4001);
        
Sparky(
    {
        name: "menu",
        category: "misc",
        fromMe: isPublic,
        desc: "Show All commands"
    },
    async ({
        client, m, args
    }) => {
      try {
            if (args) {  
            for (let i of plugins.commands) {
                if (i.name.test(args)) { 
                  return m.reply(`*command : ${args.trim()}*\n*description : ${i.desc.toLowerCase()}*`);
                }
            }
        return m.reply(font.tiny("_oops command not found_"))
        } else {
            let [date,
                time] = new Date()
            .toLocaleString("en-IN", {
                timeZone: "Asia/Kolkata"
            })
            .split(",");
            let menu = `•  owner : ${BOT_INFO.split(";")[1]}
•  mode : ${WORK_TYPE}
•  prefix : ${m.prefix}
•  date : ${date}
•  time : ${time}
•  uptime : ${await m.uptime()}
•  plugins : ${commands.length}\n ${readMore}\n\n`
            let cmnd = [];
            let Sparky;
            let type = [];
            commands.map((command, num) => {
              
                if (command.name) {
              let cmdName = command.name
                  Sparky = cmdName.source.split('\\s*')[1]
                  .toString()
                  .match(/(\W*)([A-Za-züşiğ öç1234567890]*)/)[2];
              }

              if (command.dontAddCommandList || Sparky === undefined) return;
                   
                if (!command.dontAddCommandList && Sparky !== undefined) {
                    let category;
                    if (!command.category) {
                        category = "misc";
                    } else {
                        category = command.category.toLowerCase();
                    }
                    cmnd.push({
                        Sparky, category: category
                    });
                    if (!type.includes(category)) type.push(category);
                }
            });
            cmnd.sort();
            type.sort().forEach((cmmd) => {
                // menu+= `╔═════════════════╗\n╠═ ⪼ [ ${cmmd} ]\n╠═════════════════╝\n╠═════════════════╗\n`
                menu+= `\n     *${cmmd}*\n\n`
                let comad = cmnd.filter(({
                    category
                }) => category == cmmd)
                comad.sort()
                comad.forEach(({
                    Sparky
                }, num) => {
                   menu += `• ${Sparky.trim()}\n`
                 //  menu += `_${Sparky.trim()}_\n`
                });
             //  menu += `╚.✾.════════════.✾.╝\n`
            });
           // menu += ``

            // let text = align(txt, centerAlign);
        let sperky = { "key": { "participants":"0@s.whatsapp.net", "remoteJid": "status@broadcast", "fromMe": false, "id": "Halo" }, "message": { "contactMessage": { "displayName": "X BOT MD V3","vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` }}, "participant": "0@s.whatsapp.net" }
        return await client.sendMessage(m.jid , { text : font.tiny(menu),
contextInfo: { externalAdReply: {                                           
title: font.tiny(`Hey there  ${m.pushName}`),
body: font.tiny(`this is ${BOT_INFO.split(";")[0]}`),
sourceUrl: "https://instagram.com/imspxxky",
mediaUrl: "https://instagram.com/imspxxky",
mediaType: 1,
showAdAttribution: true,
renderLargerThumbnail: false,
thumbnailUrl: `${BOT_INFO.split(";")[2]}` }}},{ quoted: sperky })
            
                      //let url = "https://i.imgur.com/XJ0D4Tq.mp4"
        //await client.sendMessage(m.jid, { video: { url: url }, gifPlayback: true, caption: font.tiny(menu), mentions: m.sender }, { quoted: sperky })
        }
      } catch (e) {
        m.error(`hey : ${e}`)
      }
    }
);
/*
//Edit Here 👍🏻
const name = "Aswin Sparky";
let number = "917012984396";
const image = "https://i.ibb.co/8rxJbFc/f4599ee35b01.jpg";
const title = "✪⏤͟͞★⃝ꪶ ѕᴩ⃪ᴀʀ⃪ⲕʏ𖥘✪͜͡➺";
const body = "ʜy ᴠʀᴏ 😃❤️";
const url = "https://wa.me/917012984396";
//----------------
// No edit needed 👍🏻
//-----------------
Sparky({name: "owner",category: "misc",fromMe: isPublic,desc: "checks owner of bot"},async ({client, m, args}) => {
const sparky = {'contacts': {'displayName': name,'contacts': [{'vcard': `BEGIN:VCARD\nVERSION:3.0\nFN:${name}\nORG:${BOT_NAME};\nTEL;type=CELL;type=VOICE;waid=${number}:${number}\nEND:VCARD`}]},'contextInfo': {'externalAdReply': {'title':title,'body':body,'thumbnailUrl':image,'mediaType': 0x1,'mediaUrl':url,'sourceUrl':url,'showAdAttribution': true}}};
let sperky = { "key": { "participants":"0@s.whatsapp.net", "remoteJid": "status@broadcast", "fromMe": false, "id": "Halo" }, "message": { "contactMessage": { "displayName": "X BOT MD V3","vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` }}, "participant": "0@s.whatsapp.net" }
client.sendMessage(m.jid,sparky,{quoted:sperky});});
*/