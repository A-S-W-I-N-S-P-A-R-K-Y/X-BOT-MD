const { Sparky, isPublic } = require("../lib/plugins.js");
const simpleGit = require('simple-git');
const git = simpleGit();
const Config = require('../config.js');
const exec = require('child_process').exec;
const Heroku = require('heroku-client');
const heroku = new Heroku({ token: Config.HEROKU_API_KEY })
const baseURI = "/apps/" + Config.HEROKU_APP_NAME;


Sparky(
    {
        name: "update",
        fromMe: true,
        desc: "updates the bot",
        category: "sudo",
    },
    async ({ m, args, client }) => {
/////////
        let {prefix} = args
    if (args === "now") {
      await git.fetch();
      var commits = await git.log([
        'main' + "..origin/" + 'main',
      ]);
      if (commits.total === 0) {
        return await m.reply("*_Bot Is Up-to-Date_*");
      } else {
        await m.reply("*_Update Started_*");

        try {
          var app = await heroku.get("/apps/" + Config.HEROKU_APP_NAME);
        } catch {
          await m.reply("_Invalid Heroku Details_");
          await new Promise((r) => setTimeout(r, 1000));
        }

        git.fetch("upstream", 'main');
        git.reset("hard", ["FETCH_HEAD"]);

        var git_url = app.git_url.replace(
          "https://",
          "https://api:" + Config.HEROKU_API_KEY + "@"
        );

        try {  
          await git.addRemote("heroku", git_url);
        } catch {
          console.log("heroku remote error");
        }
        await git.push("heroku", 'main');

        await m.reply("*_Successfully Updated_*");
      }
    }
    await git.fetch();
    var commits = await git.log(['main' + "..origin/" + 'main']);
    if (commits.total === 0) {
      await m.reply("*_No Updates Available_*");
    } else {
      var availupdate = "*ᴜᴘᴅᴀᴛᴇs ᴀʀᴇ ᴀᴠᴀɪʟᴀʙʟᴇ* \n\n";
      commits["all"].map((commit, num) => {
        availupdate += num + 1 + " ⋆ " + (commit.message) + "\n";
      });
      return await client.sendMessage(m.jid, {
        text: availupdate,
        footer: ("click here to update"),
      });
    }
/////////
    }
  );
