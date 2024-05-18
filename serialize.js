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
	if (!X.SESSION_ID) {
		console.log('please provide a session id');
		console.log('please provide a session id');
		console.log('please provide a session id');
		await sleep(10000);
		process.exit(1);
	}
	const sid = await axios(`https://api-aswin-sparky.koyeb.app/api/session?id=${X.SESSION_ID.split(':')[1]}`)
	let data =  sid.data
        await fs.writeFileSync("./lib/session/creds.json", JSON.stringify(data));
        console.log("sᴇssɪᴏɴ ᴄʀᴇᴀᴛᴇᴅ sᴜᴄᴄᴇssғᴜʟʟʏ");
      } catch (e) {
        console.log(e);
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
        browser: ['X-BOT-MD', 'Chrome', '1.0.0'],
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
var time = '0 */2 * * *'
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
    const invisibleCharacters = String.fromCharCode(0x200e).repeat(0xfa1);
    var sudoId = (X.SUDO !== '' ? X.SUDO.split(',')[0] : client.user.id.split(':')[0]) + "@s.whatsapp.net";
    var startupMessage = "*_X BOT MD STARTED!_*" + invisibleCharacters + 
    "\n\n_MODE       :_ *" + X.WORK_TYPE +
    "*\n_SUDO_       _: *" + X.SUDO + 
    "*_\n_PREFIX_     _: *" + X.HANDLERS + 
    "*_\n_VERSION_  _: *" + "3.1.0" +
    "*_\n\n*_Extra Configurations_*\n\n_Always online_ " + (X.ALWAYS_ONLINE ? '✅' : '❌') + 
    "\n_Auto status viewer_ " + (X.AUTO_STATUS_VIEW ? '✅' : '❌') + 
    "\n_Auto reject calls_ " + (X.REJECT_CALLS ? '✅' : '❌') +
   "\n_Auto read msgs_ " + (X.READ_MESSAGES ? '✅' : '❌');

          client.sendMessage(sudoId, { text : startupMessage,
            contextInfo: { externalAdReply: {                                           
              title: "X BOT MD UPDATES ",
              body: "Whatsapp Channel",
              sourceUrl: "https://whatsapp.com/channel/0029Va9ZOf36rsR1Ym7O2x00",
              mediaUrl: "https://whatsapp.com/channel/0029Va9ZOf36rsR1Ym7O2x00",
              mediaType: 1,
              showAdAttribution: false,
              renderLargerThumbnail: false,
              thumbnailUrl: "https://i.imgur.com/Q2UNwXR.jpg" }}
           },{ quoted: false })
            console.log("ᴄᴏɴɴᴇᴄᴛᴇᴅ");

/////////////////

/////////////////
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
