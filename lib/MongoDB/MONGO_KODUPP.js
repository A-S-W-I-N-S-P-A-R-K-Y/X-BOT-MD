const mongoose = require("mongoose");
const X = require("../../config.js");
const config = require("../../config.js")
const options = {
  socketTimeoutMS: 30000,
};

// ----------------------- Atlas can work with upto 4 MongoDB databases at once to distribute DB load  -------------------- //

const db1 = mongoose.createConnection(X.mongodb, options); // You malually put first mongodb url here
const db2 = mongoose.createConnection(X.mongodb, options); // You malually put second mongodb url here

const GroupSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  antilink: { type: Boolean, default: false },
  nsfw: { type: Boolean, default: false },
  bangroup: { type: Boolean, default: false },
  chatBot: { type: Boolean, default: false },
  botSwitch: { type: Boolean, default: true },
  switchNSFW: { type: Boolean, default: false },
  switchWelcome: { type: Boolean, default: false },
});

const UserSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  ban: { type: Boolean, default: false },
  name: { type: String },
  addedMods: { type: Boolean, default: false },
});

const CoreSchema = new mongoose.Schema({
  id: { type: String, unique: false, required: true, default: "1" },
  seletedCharacter: { type: String, default: "0" },
  PMchatBot: { type: Boolean, default: false },
  botMode: { type: String, default: "public" },
});

const PluginSchema = new mongoose.Schema({
  plugin: { type: String },
  url: { type: String },
});

const userData = db1.model("UserData", UserSchema);
const groupData = db1.model("GroupData", GroupSchema);
const systemData = db2.model("SystemData", CoreSchema);
const pluginData = db2.model("PluginData", PluginSchema);

module.exports = { userData, groupData, systemData, pluginData };
