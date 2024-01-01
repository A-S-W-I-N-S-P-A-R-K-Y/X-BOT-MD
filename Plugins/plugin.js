const got = require("got");
const fs = require("fs");
const path = require("path");
const { readcommands } = require("../lib/Plugins.js");
const {
  pushPlugin, 
  isPluginPresent, 
  delPlugin, 
  getAllPlugins,
  checkMod, 
} = require("../lib/MongoDB/MONGO_VEDI.js");

let mergedCommands = ["install"];
module.exports = {
  name: "plugininstaller",
  alias: [...mergedCommands],
  uniquecommands: ["install"],
  description: "Install, Uninstall, List plugins",
  start: async (Xbot, m, { text, args, pushName, prefix, inputCMD, isCreator, isintegrated, doReact }) => {
    switch (inputCMD) {
      case "install":
        chechSenderModStatus = await checkMod(m.sender);
        if (!chechSenderModStatus && !isCreator && !isintegrated) {
          if (!match) return await Xbot.sendMessage("_Send a plugin url_");

    try {
      var url = new URL(match);
    } catch (e) {
      console.log(e);
      return await Xbot.sendMessage("_Invalid Url_");
    }

    if (url.host === "gist.github.com") {
      url.host = "gist.githubusercontent.com";
      url = url.toString() + "/raw";
    } else {
      url = url.toString();
    }
    var plugin_name;
    var { body, statusCode } = await got(url);
    if (statusCode == 200) {
      var comand = body.match(/(?<=pattern:) ["'](.*?)["']/);
      plugin_name = comand[0].replace(/["']/g, "").trim().split(" ")[0];
      if (!plugin_name) {
        plugin_name = "__" + Math.random().toString(36).substring(8);
      }
      fs.writeFileSync(__dirname + "/" + plugin_name + ".js", body);
      try {
        require("./" + plugin_name);
      } catch (e) {
        fs.unlinkSync(__dirname + "/" + plugin_name + ".js");
        return await Xbot.sendMessage("Invalid Plugin\n ```" + e + "```");
      }

      await installPlugin(url, plugin_name);

      await Xbot.sendMessage(`_New plugin installed : ${plugin_name}_`);
    }
        }
        default:
        break;
    }
  },
};
