const { 
  Sparky, 
  commands, 
  isPublic 
} = require("../lib/plugins.js");
const { 
  existsSync, 
  mkdirSync, 
  writeFileSync,
  readFileSync,
  createWriteStream
} = require('fs');
const fetch = require('node-fetch')
const yts = require("yt-search")
//const ytdl = require("youtubedl-core");
const NodeID3 = require('node-id3')
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const axios = require("axios")
const {
  AddMp3Meta
} = require("../lib/functions.js");
    
Sparky(
    {
        name: "yt",
        fromMe: isPublic,
        category: "downloader",
        desc: "To download yt vid/aud"
    },
async ({

        m, client, args

    }) => {

    if (!args) return m.reply("_Enter Query !_")
   let mes = await client.sendMessage(m.jid, { text : `_Searching..._`}, {quoted : m })
    let datai = `_Youtube Downloader_\n\n`
    let search = await yts(`${args}`)
    let hdata = search.all
 
    for (let i=1; i<11; i++){
        datai += `_${i} .${hdata[i].title}_\n`
    }
   return client.sendMessage(m.jid, { text : `${datai}` , edit : mes.key })
      }
    )

        
Sparky(
    {
        name: "song",
        fromMe: isPublic,
        category: "downloader",
        desc: "To download song"
    },
    async ({
        m, client, args
    }) => {
      args = args || m.quoted?.text;
        if (!args) return m.reply("_Enter Query !_")
      let mes = await client.sendMessage(m.jid, { text : `_Searching..._` } , { quoted : m })
   const res = await axios.get(`https://api-viper-x.koyeb.app/api/song?name=${args}`)
    let response = await res.data
    let coverBuffer = await (await fetch(`${response.data.thumbnail}`)).buffer()
     client.sendMessage(m.jid, { text : `_Downloading : ${response.data.title}_` , edit : mes.key })
   const songbuff = await (await fetch(`${response.data.downloadUrl}`)).buffer()
   const song = await AddMp3Meta(songbuff , coverBuffer , { title : response.data.title , artist : response.data.channel.name } )
     return await client.sendMessage(m.jid , {audio : song ,  mimetype : 'audio/mpeg'} , { quoted : m })
      
    })
