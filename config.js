require("dotenv").config();

global.owner = process.env.SUDO || ["917012984396","917594898804"];

module.exports = {
  mongodb: process.env.MONGODB_URL || "",
  BOT_INFO: process.env.BOT_INFO || "X-BOT-MD;Aswin Sparky;https://graph.org/file/9b477aaa6b90bbb46e4be.mp4;https://i.imgur.com/MsNQ8wf.jpg",
  STICKER_DATA: process.env.STICKER_DATA || "X-BOTMD;ASWIN SPARKY",
  SESSION_ID: process.env.SESSION_ID || "",
  MENTION: process.env.MENTION || "true",
  MENTION_DATA: process.env.MENTION_DATA || 'X-BOT-MD;MULTI-DEVICE BOT BY TEAM EX-BOT-Z;https://wa.me/917012984396;https://i.imgur.com/3cMVKBk.jpeg',
  MENTION_AUDIO: process.env.MENTION_AUDIO || ["https://i.imgur.com/h0mNy8p.mp4","https://i.imgur.com/zNWjhDn.mp4","https://i.imgur.com/Ya3325t.mp4","https://i.imgur.com/k4FE9mA.mp4","https://i.imgur.com/X5WGE9W.mp4","https://i.imgur.com/veoDgRH.mp4","https://i.imgur.com/CZ3eJgw.mp4","https://i.imgur.com/6QFiAoM.mp4","https://i.imgur.com/lAbt9ew.mp4"],
  AUTO_STATUS_VIEW: process.env.AUTO_STATUS_VIEW || "true",
  CAPTION: process.env.CAPTION || "X-BOT-MD V-2.00",
  TENORAPI: process.env.TENOR_API_KEY || "AIzaSyCyouca1_KKy4W_MG1xsPzuku5oa8W358c",
  PORT: process.env.PORT || "9000",
  PREFIX: process.env.PREFIX || ".",
};
