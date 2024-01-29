const got = require("got");
const fs = require("fs");
const path = require("path");
const { readcommands } = require("../lib/Plugins.js");
const axios = require("axios");
const util = require("util");
const {
  pushPlugin, // -------------------- PUSH NEW INSTALLED PLUGIN IN DATABASE
  isPluginPresent, // --------------- CHECK IF PLUGIN IS ALREADY PRESENT IN DATABASE
  delPlugin, // --------------------- DELETE A PLUGIN FROM THE DATABASE
  getAllPlugins, // ----------------- GET ALL PLUGINS FROM DATABASE
  checkMod, // ---------------------- CHECK IF SENDER IS MOD
} = require("../lib/MongoDB/MONGO_VEDI.js");

let mergedCommands = ["install", "uninstall", "plugins", "pluginlist", "remove"];
module.exports = {
  name: "plugininstaller",
  alias: [...mergedCommands],
  uniquecommands: ["install", "uninstall", "plugins", "pluginlist", "remove"],
  description: "Install, Uninstall, List plugins",
  start: async (Xbot, m, { text, args, pushName, prefix, inputCMD, isCreator, isintegrated, doReact }) => {
    switch (inputCMD) {
        
      case "install": 
        if (!isCreator) {
          await doReact("❌");
          return await m.reply(
            `_*This is an owner command 😒*_`
          );
        }
        if (!text.includes("https://gist.github")) return await Xbot.sendMessage(
            m.from,
            { text: `_*Invalid URL !*_` },
            { quoted: m }
          );
        try {
          var url = new URL(text);
          if (url.host === "gist.github.com") {
            url.host = "gist.githubusercontent.com";
            url = url.toString() + "/raw";
          } else {
            url = url.toString();
          }
        } catch (e) {
          console.log(e);
          return await Xbot.sendMessage(
            m.from,
            { text: `_*Invalid URL !*_` },
            { quoted: m }
          );
        }
        
        var { body, statusCode } = await got(url);
        if (statusCode == 200) {
          try {
            var folderName = "Plugins";
            let plugin_name =  /pattern: ["'](.*)["'],/g.exec(body)
            fileName = plugin_name[1].split(' ')[0]
            // check if plugin is already installed and present in that Database array
            plugin = await isPluginPresent(fileName + '.js');
            if (plugin) {
              return m.reply(`*${fileName}* plugin is already Installed !`);
            }

            // Check if that file is present in same directory
            if (fs.existsSync(`./Plugins/${fileName + '.js'}`)) {
              return m.reply(
                `*${fileName}* plugin is already Present Locally !`
              );
            }

            var filePath = path.join(folderName, fileName + '.js');
            fs.writeFileSync(filePath, body);
            console.log("Plugin saved successfully!");
          } catch (error) {
            console.log("Error:", error);
          }
          await m.reply(`Installing *${fileName}*... `);
          await readcommands();
          await pushPlugin(fileName + '.js', text);
          await m.reply(`*${fileName}* Installed Successfully !`);
        }
        break;

      case "plugins":
                if (!isCreator) {
          
          await doReact("❌");
                  return await m.reply(
                    `_*This is an owner command 😒*_`
                  );
                }
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
        if (!isCreator) {
          await doReact("❌");
          return await m.reply(
            `_*This is an owner command 😒*_`
          );
        }
        if (!text) {
          return await m.reply(
            `Please provide a plugin name !\n\nExample: *${prefix}remove* mention`
          );
        }
        await doReact("🧩");
        fileName = (text + '.js');
        plugin = isPluginPresent(fileName)
/*
        if (!plugin) {
          await doReact("❌");
          return await m.reply(`*${fileName}* plugin is not installed !`);
        }
*/
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
        try {
            var res = await axios.get(`https://x-md-qr-elctro-wizard.koyeb.app/plugins`)
        
        let response = await res.data
          let sperky = `*External Plugins*\n\n`
          
            for (let i of response.data) {
              sperky+= `_*${i.title} :*_ *${i.url}*\n\n`
            }
          Xbot.sendMessage(m.from, { text : sperky },  {quoted: m })
        } catch (e) {
        console.log(e)
    }
          break;
//
      default:
        break;
    }
  },
};
