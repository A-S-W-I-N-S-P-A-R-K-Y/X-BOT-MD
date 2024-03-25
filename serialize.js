const { 
  makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  Browsers,
  getAggregateVotesInPollMessage,
  makeInMemoryStore,
  makeCacheableSignalKeyStore
} = require('@whiskeysockets/baileys');
const axios = require('axios');
const { Boom } = require('@hapi/boom');
const P = require('pino');
const path = require('path');
const fs = require('fs');
const web = require('./lib/server.js');
const MsgHandler = require('./lib/handler.js')
const cron = require('node-cron');
const {
    GevPlugin,
    PluginInstall
} = require("./lib/database/ext_plugins.js");
const got = require("got");
const {
  Client
} = require('./lib/client.js');
const X = require("./config.js")
const {
	SUDO,
	WORK_TYPE,
	HANDLERS,
	ALWAYS_ONLINE,
	AUTO_STATUS_VIEW,
} = require("./config.js")
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const config = require("./config");
const Spinnies = require("spinnies")
const spinnies = new Spinnies({
  spinner: { interval: 200, frames: [" ", "_"], }
})
 ///////
const readAndRequireFiles = async (directory) => {
  const files = await fs.readdir(directory);
  return Promise.all(
    files
      .filter((file) => path.extname(file).toLowerCase() === ".js")
      .map((file) => require(path.join(directory, file)))
  );
};
///////
async function MakeSession() {
    try {
        console.log("ᴡʀɪᴛᴛɪɴɢ sᴇssɪᴏɴ");
        const {
          data
        } = await axios(`https://paste.c-net.org/${X.SESSION_ID.split(':')[1]}`);
        await fs.writeFileSync("./lib/session/creds.json", JSON.stringify(data));
        console.log("sᴇssɪᴏɴ ᴄʀᴇᴀᴛᴇᴅ sᴜᴄᴄᴇssғᴜʟʟʏ");
      } catch (err) {
        console.log(err);
      }
}
MakeSession();
/////////////////////

async function Bot() {

    const {
        state,
        saveCreds
    } = await useMultiFileAuthState(
        "./lib/session"
    );

    //////////////////////////////////////

    const connect = makeWASocket({
        auth: {
         creds: state.creds,
         keys: makeCacheableSignalKeyStore(state.keys, P({ level: "fatal" }).child({ level: "fatal" })),
      },
        browser: Browsers.macOS('Desktop'),
        downloadHistory: false,
        syncFullHistory: false,
        logger: P({
            level: "silent"
        }),
        printQRInTerminal: true,
        getMessage: async (key) =>

        (store.loadMessage(key.id) || {}).message || { conversation: null }
    })
	    
	const client = new Client(connect)
	
	const store = makeInMemoryStore({ logger: P().child({ level: 'silent', stream: 'store' }) })

  store.bind(client.ev);

    setInterval(() => {

      store.writeToFile("./lib/database/store.json");

    }, 30 * 1000);
    
            
    //////////////////////////////////////
var time = '0 */5 * * *'
  const job = cron.schedule(time, () => {
    Bot();
    job.destroy(); bb
  }, {
    scheduled: false,
  });
  job.start();
    //////////////////////////////////////

    client.ev.on('connection.update', async(update) => {
        const {
            connection
        } = update;
        if (connection === "connecting") {
            console.log("ᴄᴏɴɴᴇᴄᴛɪɴɢ ...");
            console.log("sʏɴᴄɪɴɢ ᴅᴀᴛᴀʙᴀsᴇ...");
 // config.DATABASE.authenticate();
  config.DATABASE.sync();
        }
        if (connection === "open") {
		/*
let txt = `_X BOT MD STARTED..._\n\n_Mode : ${WORK_TYPE}_\n_Prefix : ${HANDLERS}_\n_Version : 3.00_\n\n\n_Plugins :_ https://github.com/A-S-W-I-N-S-P-A-R-K-Y/X-BOT-MD/wiki/EXTERNAL-PLUGINS\n\n\n💗`
let URL = "https://whatsapp.com/channel/0029Va9ZOf36rsR1Ym7O2x00"
return await client.sendMessage(`${SUDO.split(",")[0]}@s.whatsapp.net` , { text : txt,
contextInfo: { externalAdReply: {                                           
title: "X BOT MD UPDATES 💗",
body: "Join For Updats",
sourceUrl: URL,
mediaUrl: URL,
mediaType: 1,
showAdAttribution: false,
renderLargerThumbnail: true,
thumbnailUrl: "https://i.imgur.com/Q2UNwXR.jpg" }}},{ quoted: false })
		*/
          client.sendMessage(`${SUDO.split(",")[0]}@s.whatsapp.net`, { text : `_X BOT MD STARTED..._\n\n_Mode : ${WORK_TYPE}_\n_Prefix : ${HANDLERS}_\n_Version : 3.00_\n\n\n_Plugins :_ https://github.com/A-S-W-I-N-S-P-A-R-K-Y/X-BOT-MD/wiki/EXTERNAL-PLUGINS`})
            console.log("ᴄᴏɴɴᴇᴄᴛᴇᴅ");
            
          var plugins = await GevPlugin.findAll();
        plugins.map(async (plugin) => {
            if (!fs.existsSync('./plugins/' + plugin.dataValues.name + '.js')) {
                var response = await got(plugin.dataValues.url);
                if (response.statusCode == 200) {
              fs.writeFileSync('./plugins/' + plugin.dataValues.name + '.js', response.body);
                    require('./plugins/' + plugin.dataValues.name + '.js');
console.log("ᴇxᴛᴇʀɴᴀʟ ᴘʟᴜɢɪɴs ɪɴsᴛᴀʟʟᴇᴅ")
                }     
            }
        });
          
          fs.readdirSync("./plugins").forEach((plugin) => {
                if (path.extname(plugin).toLowerCase() == ".js") {
          import("./plugins/" + plugin);
                }
            });
            console.log("ᴘʟᴜɢɪɴs ʟᴏᴀᴅᴇᴅ");
          console.log("\n======[  ☞︎︎︎  ʟᴏɢs  ☜︎︎︎   ]======\n")
        }
      
    })

    //////////////////////////////////////
//client.sendPresenceUpdate('unavailable', m.user)
  ////////////////

  async function getMessage(key){
        if (store) {
            const msg = await store.loadMessage(key.remoteJid, key.id)
            return msg?.message
        }
        return {
            conversation: "wabot"
        }
  }

    client.ev.on("creds.update", saveCreds);

    //////////////////////////////////////


    //////////////////////////////////////

    client.ev.on('messages.upsert',
       async (message) => { //console.log(message.messages[0].message)
          await MsgHandler(client , message)
        })


} 

process.on('uncaughtException', function (err) {
let e = String(err)
if (e.includes("Socket connection timeout")) return
if (e.includes("item-not-found")) return
if (e.includes("rate-overlimit")) return
if (e.includes("Connection Closed")) return
if (e.includes("Timed Out")) return
if (e.includes("Value not found")) return
console.log('Caught exception: ', err)
})

setTimeout(() => {
web("ᴄᴏɴɴᴇᴄᴛᴇᴅ ✅")
Bot();
    }, 5000);
