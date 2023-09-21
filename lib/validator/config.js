"use strict";

const fs = require('fs')
const chalk = require('chalk')
global.ownerNumber = ["917594898804,917012984396"]
module.exports = {
  sesionName: "session",
  banchats: false,
  autoreadstatus: true,
  anticall: true,

  banned: {
   maroko: true,
   india: false,
  },
  
  botname: "x-ʙᴏᴛ-ᴍᴅ",
  ownername: "ᴛᴏxɪᴄ-ᴋʀɪᴢ",
  author: "ᴋʀɪᴢ × ꜱᴩᴀʀᴋy",
  packname: "x-ʙᴏᴛ-ᴍᴅ",
  api:{
     openai: ['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'],
      },
  modul: {
    qrcode: require('qrcode'),  	
    QrCode: require('qrcode-reader'),  
    bochil: require("@bochilteam/scraper"),
    baileys: require("@sampandey001/baileys"),
    boom: require('@hapi/boom'),
    chalk: require('chalk'),
    ikyy: require('ikyy'),
    child: require('child_process'),
    fs: require('fs'),
    pino: require("pino"),
    path: require("path"),
    phonenumber: require('awesome-phonenumber'),
    time: require("moment-timezone"),
    jimp: require('jimp'),
    speed: require('performance-now'),
    util: require("util"),
    https: require('https'),
    sizeFormater: require('human-readable'),
    axios: require('axios'),
    ytsr: require('yt-search'),
    yts: require('yt-search'),           
    qrcode: require('qrcode'), 
    qrcodereader: require('qrcode-reader'),
    request: require('request'),
    openai: require("openai"),
    readline: require("readline"),
    nodecache: require("node-cache"),
   },
  file: {
    load: './connection/starting',
    color: './lib/color',
    move: './lib/simple.js', 
    yanz: './lib/myfunc',
    funct: './lib/function',
    exif: './lib/exif',
    thumb: './storage/image/thumb.jpg',
    list: './lib/list',
    scrapp: './lib/scraper',
  },

}
let file = require.resolve(__filename)
fs.watchFile(file, () => {
	fs.unwatchFile(file)
	console.log(chalk.yellow(`New ${__filename}`))
	delete require.cache[file]
	require(file)
})
 
 //end
