const fs = require('fs');
const dotenv = require('dotenv');
const { Sequelize } = require('sequelize');
if (fs.existsSync('config.env')) {
  dotenv.config({
    path: './config.env'
  });
}

const HANDLERS = process.env.HANDLER === undefined ? "^" : process.env.HANDLER;
const SESSION_ID = process.env.SESSION_ID || "";
const SUDO = process.env.SUDO || '917012984396';
const BOT_INFO = process.env.BOT_INFO || "X-BOT-MD;ASWIN SPARKY;https://i.imgur.com/r3GZeiX.jpeg";
//const AUDIO_DATA‎ = process.env.AUDIO_DATA‎ || "X BOT MD;ASWIN SPARKY;https://i.imgur.com/fVCRCYG.jpeg";
const STICKER_DATA = process.env.STICKER_DATA || "X BOT MD;ASWIN SPARKY";
const WORK_TYPE = process.env.WORK_TYPE || 'public'
const DATABASE_URL = process.env.DATABASE_URL || "./lib/database.db";
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
  SUDO,
  WORK_TYPE,
  DATABASE,
  SESSION_ID,
  STICKER_DATA,
  BOT_INFO
};
