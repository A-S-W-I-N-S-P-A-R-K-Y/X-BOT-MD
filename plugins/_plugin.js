const got = require("got");
const fs = require("fs");
const {
    Sparky
} = require("../lib/plugins.js");
const {
    GevPlugin,
    PluginInstall
} = require("../lib/database/ext_plugins.js");

Sparky(
    {
        name: "plugin",
        fromMe: true,
        desc: "Installs External plugins",
        category: "sudo",
    },
    async ({client, m, args}) => {
        args = args || m.quoted?.text;
        if (!args) return m.reply("_Send a plugin url_");

      try {
        var url = new URL(args);
      } catch (e) {
        console.log(e);
        return await m.reply("_Invalid Url_");
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
        var comand = body.match(/(?<=name:) ["'](.*?)["']/);
        plugin_name = comand[0].replace(/["']/g, "").trim().split(" ")[0];
        
            if (!plugin_name) {
                plugin_name = "__" + Math.random().toString(36).substring(8);
            }
            fs.writeFileSync(__dirname + "/" + plugin_name + ".js", body);
            try {
                require("./" + plugin_name);
            } catch (e) {
                fs.unlinkSync(__dirname + "/" + plugin_name + ".js");
                return await m.sendMsg(m.jid , "Invalid Plugin\n ```" + e + "```");
            }

            await PluginInstall(url, plugin_name);

            await m.sendMsg(m.jid , `_New plugin installed : ${plugin_name}_`);
        }
    }
);

Sparky(
    {
        name: "plugins",
        fromMe: true,
        desc: "plugin list",
        category: "sudo"
    },
    async ({client, m, args}) => {
        var mesaj = "";
        var plugins = await GevPlugin.findAll();
        if (plugins.length < 1) {
            return await m.reply("_No external plugins installed_");
        } else {
            plugins.map((plugin) => {
                mesaj +=
                "```" +
                plugin.dataValues.name +
                "```: " +
                plugin.dataValues.url +
                "\n";
            });
            return await m.reply(mesaj);
        }
    }
);



Sparky(
    {
        name: "remove",
        fromMe: true,
        desc: "Remove external plugins",
        category: "sudo",
    },
    async ({client, m, args}) => {
       
    if (!args) return m.reply("_Need a plugin name_");

        var plugins = await GevPlugin.findAll({
            where: {
                name: args
            }
        });

        if (plugins.length < 1) {
            return await m.reply("_Plugin not found_");
        } else {
            await plugins[0].destroy();
            delete require.cache[require.resolve("./" + args + ".js")];
            fs.unlinkSync(__dirname + "/" + args + ".js");
            await m.reply(`Plugin ${args} deleted`);
        }
    }
);
