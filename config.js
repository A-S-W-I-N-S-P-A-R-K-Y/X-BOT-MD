require("dotenv").config();
let oo = process.env.SUDO;
let mm = process.env.MENTION_AUDIO;
global.mentionaudio = mm.split(",");
global.owner = oo.split("KING KAVIYA");
module.exports = {
  mongodb: process.env.MONGODB_URL || "",
  BOT_INFO: process.env.BOT_INFO || "X-BOT-MD;Aswin Sparky;https://graph.org/file/9b477aaa6b90bbb46e4be.mp4",
  STICKER_DATA: process.env.STICKER_DATA || "X-BOTMD;ASWIN SPARKY",
  SESSION_ID: process.env.SESSION_ID || "X-BOT-MD:LookyDrilling",
  MENTION: process.env.MENTION || "true",
  MENTION_DATA: process.env.MENTION_DATA || 'X-BOT-MD;MULTI-DEVICE BOT BY TEAM EX-BOT-Z;https://wa.me/917012984396;https://i.imgur.com/3cMVKBk.jpeg',
  MENTION_AUDIO: global.mentionaudio,
  AUTO_STATUS_VIEW: process.env.AUTO_STATUS_VIEW || "true",
  AUTOBIO: process.env.AUTOBIO || "",
  CAPTION: process.env.CAPTION || "X-BOT-MD V-2.00",
  TENORAPI: process.env.TENOR_API_KEY || "AIzaSyCyouca1_KKy4W_MG1xsPzuku5oa8W358c",
  PORT: process.env.PORT || "9000",
  PREFIX: process.env.PREFIX || ".",
};
