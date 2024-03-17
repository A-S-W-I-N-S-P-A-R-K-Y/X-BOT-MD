const fs = require('fs');
const dotenv = require('dotenv');
const { Sequelize } = require('sequelize');
if (fs.existsSync('config.env')) {
  dotenv.config({
    path: './config.env'
  });
}

const HANDLERS = process.env.HANDLER === undefined ? "^" : process.env.HANDLER;
//const HANDLERS =  process.env.HANDLER === "false" || '^';
const SESSION_ID = process.env.SESSION_ID || "";
//const HANDLERS = process.env.HANDLER === 'false' || process.env.HANDLER === 'null' ? '^' : '^';
const AUTHOR = process.env.AUTHOR || 'sparky';
const SUDO = process.env.SUDO || '919656459062,917012984396';
const OWNER_NAME = process.env.OWNER_NAME || 'sparky';
const BOT_NAME = process.env.BOT_NAME || 'WhatsApp-Bot';
const BOT_INFO = process.env.BOT_INFO || "X-BOT-MD;ASWIN SPARKY;https://i.imgur.com/r3GZeiX.jpeg";
//const AUDIO_DATA‎ = process.env.AUDIO_DATA‎ || "X BOT MD;ASWIN SPARKY;https://i.imgur.com/fVCRCYG.jpeg";
const STICKER_DATA = process.env.STICKER_DATA || "X BOT MD;ASWIN SPARKY";
const WORK_TYPE = process.env.WORK_TYPE || 'public'
const DATABASE_URL = process.env.DATABASE_URL ||'postgres://viper_sql_user:APW8aUC7b48Bifkod5ytFICG9eTuQ24c@dpg-cng830fsc6pc73eno5a0-a.oregon-postgres.render.com/viper_sql';
const DATABASE = new Sequelize(DATABASE_URL, {
   dialectOptions: {
    ssl: {
     require: true,
     rejectUnauthorized: false
    } 
   }, logging: false 
  });



module.exports = {
  HANDLERS,
  AUTHOR,
  SUDO,
  OWNER_NAME,
  BOT_NAME,
  WORK_TYPE,
  DATABASE,
  SESSION_ID,
  STICKER_DATA,
  BOT_INFO
};
