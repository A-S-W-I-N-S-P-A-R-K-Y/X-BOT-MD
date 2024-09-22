const fs = require('fs');
const dotenv = require('dotenv');
const { Sequelize } = require('sequelize');
if (fs.existsSync('config.env')) {
  dotenv.config({
    path: './config.env'
  });
}

const API = "https://api-aswin-sparky.koyeb.app";
const ALIVE = process.env.ALIVE || "I am Alive 𝚊𝚗𝚍 𝚊𝚕𝚜𝚘 𝚋𝚞𝚐𝚐𝚒𝚗𝚐 𝚜𝚘 𝚍𝚘 𝚗𝚘𝚝 𝚙𝚒𝚜𝚜 𝚖𝚢 𝚘𝚠𝚗𝚎𝚛 𝚘𝚛 𝚢𝚘𝚞 𝚐𝚎𝚝 𝚋𝚞𝚐𝚐𝚎𝚍";
const HANDLERS = process.env.HANDLER || ".";
const SESSION_ID = process.env.SESSION_ID || "";
const SUDO = process.env.SUDO || '263784562833';
const AUTO_STATUS_VIEW = process.env.AUTO_STATUS_VIEW || "true";
const ALWAYS_ONLINE = process.env.ALWAYS_ONLINE || "false";
const DISABLE_PM = process.env.DISABLE_PM  || "true";
const PM_BLOCK = process.env.PM_BLOCK || "true";
const PMB = process.env.PMB || "Sorry, I can't help you in private chat.";
const READ_MESSAGES = process.env.READ_MESSAGES || "false";
const BOT_INFO = process.env.BOT_INFO || "𝐍𝐎𝐕𝐀;𝚂𝚃𝚁𝙸𝙺𝙴𝚁𝙱𝙾𝚈;https://i.imgur.com/3Fq3Ucq.jpeg";
const URL = process.env.URL || "https://whatsapp.com/channel/0029VafbajGDuMRoRlel7k1p";
const AUDIO_DATA = process.env.AUDIO_DATA || "𝐍𝐎𝐕𝐀;𝚂𝚃𝚁𝙸𝙺𝙴𝚁𝙱𝙾𝚈;https://i.imgur.com/3Fq3Ucq.jpeg";
const STICKER_DATA = process.env.STICKER_DATA || "𝐍𝐎𝐕𝐀;𝚂𝚃𝚁𝙸𝙺𝙴𝚁𝙱𝙾𝚈";
const WORK_TYPE = process.env.WORK_TYPE || 'public';
const DATABASE_URL = process.env.DATABASE_URL || "./lib/database.db";
const HEROKU_APP_NAME = process.env.HEROKU_APP_NAME || "";
const HEROKU_API_KEY = process.env.HEROKU_API_KEY || "";
const KOYEB_API_KEY = process.env.KOYEB_API_KEY || "";












module.exports = {
  API,
  ALIVE,
  HANDLERS,
  SUDO,
  WORK_TYPE,
  SESSION_ID,
  STICKER_DATA,
  BOT_INFO,
  AUDIO_DATA,
  AUTO_STATUS_VIEW,
  ALWAYS_ONLINE,
  PM_BLOCK,
  PMB,
  READ_MESSAGES,
  DISABLE_PM,
  URL,
  VERSION:"3.2.0",
  HEROKU_API_KEY,
  HEROKU_APP_NAME,
  KOYEB_API_KEY,
  DATABASE_URL: DATABASE_URL,
  DATABASE:
    DATABASE_URL === "./lib/database.db"
      ? new Sequelize({
          dialect: "sqlite",
          storage: DATABASE_URL,
          logging: false,
        })
      : new Sequelize(DATABASE_URL, {
          dialect: "postgres",
          ssl: true,
          protocol: "postgres",
          dialectOptions: {
            native: true,
            ssl: { require: true, rejectUnauthorized: false },
          },
          logging: false,
        }),
};
