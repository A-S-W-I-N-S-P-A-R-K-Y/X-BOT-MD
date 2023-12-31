const got = require("got");
const fs = require("fs");
const path = require("path");
const { readcommands } = require("../lib/Plugins.js");
const {
  pushPlugin, // -------------------- PUSH NEW INSTALLED PLUGIN IN DATABASE
  isPluginPresent, // --------------- CHECK IF PLUGIN IS ALREADY PRESENT IN DATABASE
  delPlugin, // --------------------- DELETE A PLUGIN FROM THE DATABASE
  getAllPlugins, // ----------------- GET ALL PLUGINS FROM DATABASE
  checkMod, // ---------------------- CHECK IF SENDER IS MOD
} = require("../lib/MongoDB/MONGO_VEDI.js");

let mergedCommands = ["install", "uninstall", "plugins", "pluginlist","remove"];
module.exports = {
  name: "plugininstaller",
  alias: [...mergedCommands],
  uniquecommands: ["install", "uninstall", "plugins", "pluginlist","remove"],
  description: "Install, Uninstall, List plugins",
  start: async (Xbot, m, { text, args, pushName, prefix, inputCMD, isCreator, isintegrated, doReact }) => {
    switch (inputCMD) {
      case "install":
        chechSenderModStatus = await checkMod(m.sender);
        if (!chechSenderModStatus && !isCreator && !isintegrated) {
          await doReact("❌");
          return Xbot.sendMessage(m.from, {
            text: `_*This is an owner command 😒*_`,
            quoted: m,
          });
        }
        try {
          var url = new URL(text);
        } catch (e) {
          console.log(e);
          return await client.sendMessage(
            m.from,
            { text: `Invalid URL !` },
            { quoted: m }
          );
        }

        if (url.host === "gist.github.com") {
          url.host = "gist.githubusercontent.com";
          url = url.toString() + "/raw";
        } else {
          url = url.toString();
        }
        var { body, statusCode } = await got(url);
        if (statusCode == 200) {
          try {
            var folderName = "Plugins";
            fileName = path.basename(url);

            // check if plugin is already installed and present in that Database array
            plugin = await isPluginPresent(fileName);
            if (plugin) {
              return m.reply(`*${fileName}* plugin is already Installed !`);
            }

            // Check if that file is present in same directory
            if (fs.existsSync(`./Plugins/${fileName}`)) {
              return m.reply(
                `*${fileName}* plugin is already Present Locally !`
              );
            }

            var filePath = path.join(folderName, fileName);
            fs.writeFileSync(filePath, body);
            console.log("Plugin saved successfully!");
          } catch (error) {
            console.log("Error:", error);
          }
          await m.reply(`Installing *${fileName}*... `);
          await readcommands();
          await pushPlugin(fileName, text);
          await m.reply(`*${fileName}* Installed Successfully !`);
        }
        break;

      case "plugins":
        await doReact("🧩");
        const plugins = await getAllPlugins();
        if (!plugins.length) {
          await Xbot.sendMessage(
            m.from,
            { text: `No additional plugins installed !` },
            { quoted: m }
          );
        } else {
          txt = "_*External Plugins*_\n\n";
          for (var i = 0; i < plugins.length; i++) { 
            txt += `*${plugins[i].plugin}* : *${plugins[i].url}*\n\n`;
          }
          txt += ``;
          await Xbot.sendMessage(m.from, { text: txt }, { quoted: m });
        }

        break;

      case "uninstall": case "remove":
        chechSenderModStatus = await checkMod(m.sender);
        if (!chechSenderModStatus && !isCreator && !isintegrated) {
          await doReact("❌");
          return Xbot.sendMessage(m.from, {
            text: `_*This is an owner command 😒*_`,
            quoted: m,
          });
        }
        if (!text) {
          return await m.reply(
            `Please provide a plugin name !\n\nExample: *${prefix}uninstall* mention.js`
          );
        }
        await doReact("🧩");
        fileName = text + '.js';
        plugin = isPluginPresent(fileName)

        if (!plugin) {
          await doReact("❌");
          return await m.reply(`*${fileName}* plugin is not installed !`);
        }

        if (fs.existsSync(`./Plugins/${fileName}`)) {
          fs.unlinkSync(`./Plugins/${fileName}`);
          await delPlugin(fileName);
          await readcommands();
          await m.reply(
            `*${fileName}* plugin uninstalled successfully !\n\nPlease restart the bot to clear cache !`
          );
        } else {
          await doReact("❌");
          return m.reply(`*${fileName}* plugin is not installed !`);
        }

        break;

        case "pluginlist":
          await doReact("🧩");
          textssf = `_*EXTERNAL PLUGINS*_ \n\n
How to install a *PLUGIN* \n
.install _*plugin_url*_ \n\n
How to Unistall/Remove a *Plugin* \n
.unistall plugin_name.js (extention needed eg: .js)\n\n\n
*_AVALABLE PLUGINS_* \n
Check : *https://github.com/A-S-W-I-N-S-P-A-R-K-Y/X-BOT-MD/wiki/EXTERNAL-PLUGINS*`;
          await Xbot.sendMessage(m.from, { image: {url: "https://i.imgur.com/HkSsfme.jpeg"},caption: textssf }, { quoted: m });
          break;
      default:
        break;
    }
  },
};
