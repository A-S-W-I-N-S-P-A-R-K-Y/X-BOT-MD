const { Sparky, commands, isPublic } = require("../lib/plugins.js");

//-------------------
// Edit Here 🤝🏻
//--------------------
var voice = true
var wave = [00,99,00,99,00,99,00,99,00,99,00] //Array.from({length: 30}, () => Math.floor(Math.random() * 100)) //for random wave 
var title = "X-BOT-MD V3"
var body = "BOT UPDATE SOON"
var url = "https://wa.me/917012984396"
var thumbnail = "https://i.imgur.com/oriEiCi.jpg"
var msg_ad = true

//-------------------
// No need to Edit stuff here ☠️👍🏿
//--------------------

Sparky(
    {
        name: "fd",
        fromMe: true,
        desc: "fd",
        category: "sudo",
    },
    async ({
        m, client, args
    }) => {
      let media = await m.quoted.download()
      let buffer = media
 let sperky = { "key": { "participants":"0@s.whatsapp.net", "remoteJid": "status@broadcast", "fromMe": false, "id": "Halo" }, "message": { "contactMessage": { "displayName": "X BOT MD V3","vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` }}, "participant": "0@s.whatsapp.net" }
        let jids = args.split(",")
 for (let i of jids) {
      if(m.quoted.message.audioMessage){
        client.sendMessage(i, { audio : buffer,waveform: wave,ptt:voice,mimetype:"audio/mpeg" ,contextInfo: {externalAdReply: {title: title,body: body,sourceUrl: url,mediaUrl: url,mediaType: 1,showAdAttribution: msg_ad,renderLargerThumbnail: true,thumbnailUrl: thumbnail }}},{quoted: sperky})
      }
        if(m.quoted.message.imageMessage){
            client.sendMessage(i, { image : buffer,mimetype:"image/jpeg" ,contextInfo: {externalAdReply: {title: title,body: body,sourceUrl: url,mediaUrl: url,mediaType: 1,showAdAttribution: msg_ad,renderLargerThumbnail: true,thumbnailUrl: thumbnail }}},{quoted: sperky})
        }
        if(m.quoted.message.videoMessage){
            client.sendMessage(i, { video : buffer,mimetype:"video/mp4" ,contextInfo: { externalAdReply: {title: title,body: body,sourceUrl: url,mediaUrl: url,mediaType: 1,showAdAttribution: msg_ad,renderLargerThumbnail: true,thumbnailUrl: thumbnail }}},{quoted: sperky})
        }
        if(m.quoted.message.stickerMessage){
            client.sendMessage(i, buffer, {contextInfo: { externalAdReply: {title: title,body: body,sourceUrl: url,mediaUrl: url,mediaType: 1,showAdAttribution: msg_ad,renderLargerThumbnail: true,thumbnailUrl: thumbnail }}},{quoted: sperky})
        }
 } 
    }
);
