const {
  banUser, //----------------------- BAN
  checkBan, // --------------------- CHECK BAN STATUS
  unbanUser, // -------------------- UNBAN
  addMod, // ----------------------- ADD MOD
  checkMod, // --------------------- CHECK MOD STATUS
  delMod, // ----------------------- DEL MOD
  setChar, // ---------------------- SET CHAR ID
  getChar, // ---------------------- GET CHAR ID
  activateChatBot, // -------------- ACTIVATE PM CHATBOT
  checkPmChatbot, // --------------- CHECK PM CHATBOT STATUS
  deactivateChatBot, // ------------ DEACTIVATE PM CHATBOT
  setBotMode, // ------------------- SET BOT MODE
  getBotMode, // ------------------- GET BOT MODE
  banGroup, // --------------------- BAN GROUP
  checkBanGroup, //----------------- CHECK BAN STATUS OF A GROUP
  unbanGroup, // ------------------- UNBAN GROUP
} = require("../lib/MongoDB/MONGO_VEDI.js");

const fs = require('fs')
const { userData } = require("../lib/MongoDB/MONGO_KODUPP.js");
const sleep = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};
let mergedCommands = [
  "setsudo",
  "setmod",
  "delsudo",
  "removemod",
  "modlist",
  "listsudo",
  "ban",
  "banuser",
  "unban",
  "unbanuser",
  "banlist",
  "listbans",
  "dmchatbot",
  "pmchatbot",
  "bangroup",
  "bangc",
  "unbangroup",
  "unbangc",
  "setbotmode",
  "mode",
  "shutdown",
  "restart",
  "session",
  "cs",
];

module.exports = {
  name: "moderators",
  alias: [...mergedCommands],
  uniquecommands: [
    "setsudo",
    "delsudo",
    "listsudo",
    "ban",
    "unban",
    "banlist",
    "setchar",
    "pmchatbot",
    "bangroup",
    "unbangroup",
    "mode",
    "shutdown",
    "restart",
    "session",
    "cs",
  ],
  description: "All Moderator/Owner Commands",
  start: async (
    Xbot,
    m,
    {
      inputCMD,
      text,
      mods,
      isCreator,
      banData,
      prefix,
      db,
      doReact,
      args,
      itsMe,
      participants,
      metadata,
      mentionByTag,
      mime,
      isMedia,
      quoted,
      botNumber,
      isBotAdmin,
      groupAdmin,
      isAdmin,
      pushName,
      groupName,
    }
  ) => {
    isUsermod = await checkMod(m.sender);
    if (!isCreator) {
      await doReact("❌");
      return m.reply("Sorry, only my *SUDO* can use this command !");
    }
    switch (inputCMD) {
      case "setsudo":
      case "setmod":
        if (!text && !m.quoted) {
          await doReact("❌");
          return m.reply(`Please tag a user to make *SUDO*!`);
        }
        mentionedUser = m.quoted ? m.quoted.sender : mentionByTag[0];
        userId = mentionedUser;
        isUsermod = await checkMod(userId);
        if (!isCreator) {
          await doReact("❌");
          return m.reply(
            "Sorry, only my *Owner* can use this command ! *Added SUDO* does not have this permission."
          );
        }
        if (!userId) return m.reply("Please mention a valid user to ban!");

        try {
          if (isUsermod) {
            await doReact("✅");
            return Xbot.sendMessage(
              m.from,
              {
                text: `@${userId.split("@")[0]} is already registered as a SUDO`,
                mentions: [userId],
              },
              { quoted: m }
            );
          }

          // Add user to the SUDO list and save to the database
          await doReact("✅");
          await addMod(userId)
            .then(() => {
              Xbot.sendMessage(
                m.from,
                {
                  text: `@${
                    userId.split("@")[0]
                  } is successfully registered to SUDO`,
                  mentions: [userId],
                },
                { quoted: m }
              );
            })
            .catch((err) => {
              console.log(err);
            });
        } catch (err) {
          console.log(err);
        }
        break;

      case "delsudo":
      case "removemod":
        // Check if a user is mentioned
        if (!text && !m.quoted) {
          await doReact("❔");
          return m.reply(`Please tag a user to remove from *SUDO*!`);
        }
        mentionedUser = m.quoted ? m.quoted.sender : mentionByTag[0];
        userId = mentionedUser;
        isUsermod = await checkMod(userId);
        if (!isCreator) {
          await doReact("❌");
          return m.reply(
            "Sorry, only my *Owner* can use this command ! *Added SUDO* does not have this permission."
          );
        }
        if (!userId) return m.reply("Please mention a valid user to ban!");

        try {
          if (!isUsermod) {
            await doReact("✅");
            return Xbot.sendMessage(
              m.from,
              {
                text: `@${userId.split("@")[0]} is not registered as a mod !`,
                mentions: [userId],
              },
              { quoted: m }
            );
          }

          await delMod(userId)
            .then(() => {
              Xbot.sendMessage(
                m.from,
                {
                  text: `@${
                    userId.split("@")[0]
                  } is successfully removed to SUDO`,
                  mentions: [userId],
                },
                { quoted: m }
              );
            })
            .catch((err) => {
              console.log(err);
            });
        } catch (err) {
          console.log(err);
        }
        break;

      case "modlist":
      case "listsudo":
        await doReact("✅");
        try {
          var modlist = await userData.find({ addedMods: "true" });
          var modlistString = "";
          var ownerList = global.owner;
          modlist.forEach((mod) => {
            modlistString += `\n@${mod.id.split("@")[0]}\n`;
          });
          var mention = await modlist.map((mod) => mod.id);
          let xy = modlist.map((mod) => mod.id);
          let yz = ownerList.map((owner) => owner + "@s.whatsapp.net");
          let xyz = xy.concat(yz);

          ment = [ownerList.map((owner) => owner + "@s.whatsapp.net"), mention];
          let textM = ``;

          if (ownerList.length == 0) {
            textM = "*No SUDO Added !*";
          }

          textM += `\n_*Owners*_\n`;

          for (var i = 0; i < ownerList.length; i++) {
            textM += `\n  @${ownerList[i]}\n`;
          }

          if (modlistString != "") {
            textM += `\n_*SUDO*_\n`;
            for (var i = 0; i < modlist.length; i++) {
              textM += `\n  @${modlist[i].id.split("@")[0]}\n`;
            }
          }

          if (modlistString != "" || ownerList.length != 0) {
            textM += ``;
          }

          Xbot.sendMessage(
            m.from,
            {
              video: { url: botVideo },
              gifPlayback: true,
              caption: textM,
              mentions: xyz,
            },
            { quoted: m }
          );
        } catch (err) {
          console.log(err);
          await doReact("❌");
          return Xbot.sendMessage(
            m.from,
            { text: `An internal error occurred while fetching the mod list.` },
            { quoted: m }
          );
        }

        break;

      case "ban":
      case "banuser":
        if (!text && !m.quoted) {
          await doReact("❌");
          return Xbot.sendMessage(
            m.from,
            { text: `Please tag a user to *Ban*!` },
            { quoted: m }
          );
        } else if (m.quoted) {
          var mentionedUser = m.quoted.sender;
        } else {
          var mentionedUser = mentionByTag[0];
        }
        
        if (!isCreator) {
          await doReact("❌");
          return Xbot.sendMessage(m.from, {
            text: `_*This is an owner command 😒*_`,
            quoted: m,
          });
        }
        userId = (await mentionedUser) || m.msg.contextInfo.participant;
        chechBanStatus = await checkBan(userId);
        checkUserModStatus = await checkMod(userId);
        userNum = userId.split("@")[0];
        globalOwner = global.owner;
        if (checkUserModStatus == true || globalOwner.includes(userNum)) {
          await doReact("❌");
          return m.reply(`Sorry, I can't ban an *Owner* or *Mod* !`);
        }
        if (chechBanStatus) {
          await doReact("✅");
          return Xbot.sendMessage(
            m.from,
            {
              text: `@${mentionedUser.split("@")[0]} is already *Banned* !`,
              mentions: [mentionedUser],
            },
            { quoted: m }
          );
        } else {
          banUser(userId).then(async () => {
            await doReact("✅");
            await Xbot.sendMessage(
              m.from,
              {
                text: `@${
                  mentionedUser.split("@")[0]
                } has been *Banned* Successfully by *${pushName}*`,
                mentions: [mentionedUser],
              },
              { quoted: m }
            );
          });
        }

        break;

      case "unban":
      case "unbanuser":
        if (!text && !m.quoted) {
          await doReact("❌");
          return m.reply(`Please tag a user to *Un-Ban*!`);
        } else if (m.quoted) {
          var mentionedUser = m.quoted.sender;
        } else {
          var mentionedUser = mentionByTag[0];
        }
        
        if (!isCreator) {
          await doReact("❌");
          return Xbot.sendMessage(m.from, {
            text: `_*This is an owner command 😒*_`,
            quoted: m,
          });
        }
        userId = (await mentionedUser) || m.msg.contextInfo.participant;
        chechBanStatus = await checkBan(userId);
        if (chechBanStatus) {
          unbanUser(userId).then(async () => {
            await doReact("✅");
            await Xbot.sendMessage(
              m.from,
              {
                text: `@${
                  mentionedUser.split("@")[0]
                } has been *Un-Banned* Successfully by *${pushName}*`,
                mentions: [mentionedUser],
              },
              { quoted: m }
            );
          });
        } else {
          await doReact("❌");
          return Xbot.sendMessage(m.from, {
            text: `@${mentionedUser.split("@")[0]} is not *Banned* !`,
            mentions: [mentionedUser],
            quoted: m,
          });
        }
        break;

      case "dmchatbot":
      case "pmchatbot":
        if (!text) {
          await doReact("❌");
          return m.reply(
            `Please provide On / Off action !\n\n*Example:*\n\n${prefix}pmchatbot on`
          );
        }
        
        if (!isCreator) {
          await doReact("❌");
          return Xbot.sendMessage(m.from, {
            text: `_*This is an owner command 😒*_`,
            quoted: m,
          });
        }
        pmChatBotStatus = await checkPmChatbot();
        await doReact("🧩");
        if (args[0] === "on") {
          if (pmChatBotStatus) {
            await doReact("❌");
            return Xbot.sendMessage(m.from, {
              text: `Private Chatbot is already *Enabled* !`,
              quoted: m,
            });
          } else {
            await activateChatBot();
            await m.reply(
              `*PM Chatbot* has been *Enabled* Successfully ! \n\nBot will reply to all chats in PM !`
            );
          }
        } else if (args[0] === "off") {
          if (!pmChatBotStatus) {
            await doReact("❌");
            return Xbot.sendMessage(m.from, {
              text: `Private Chatbot is already *Disabled* !`,
              quoted: m,
            });
          } else {
            await deactivateChatBot();
            await m.reply(`*PM Chatbot* has been *Disabled* Successfully !`);
          }
        } else {
          await doReact("❌");
          return m.reply(
            `Please provide On / Off action !\n\n*Example:*\n\n${prefix}pmchatbot on`
          );
        }

        break;

      case "bangroup":
      case "bangc":
        if (!m.isGroup) {
          await doReact("❌");
          return m.reply(`This command can only be used in groups !`);
        }

        
        if (!isCreator) {
          await doReact("❌");
          return Xbot.sendMessage(m.from, {
            text: `_*This is an owner command 😒*_`,
            quoted: m,
          });
        }

        groupBanStatus = await checkBanGroup(m.from);
        if (groupBanStatus) {
          await doReact("❌");
          return Xbot.sendMessage(m.from, {
            text: `This group is already *Banned* !`,
            quoted: m,
          });
        } else {
          await doReact("🧩");
          await banGroup(m.from);
          await m.reply(`*${groupName}* has been *Banned* Successfully !`);
        }

        break;

      case "unbangroup":
      case "unbangc":
        if (!m.isGroup) {
          await doReact("❌");
          return m.reply(`This command can only be used in groups !`);
        }

        
        if (!isCreator) {
          await doReact("❌");
          return Xbot.sendMessage(m.from, {
            text: `_*This is an owner command 😒*_`,
            quoted: m,
          });
        }

        groupBanStatus = await checkBanGroup(m.from);
        if (!groupBanStatus) {
          await doReact("❌");
          return Xbot.sendMessage(m.from, {
            text: `This group is not banned !`,
            quoted: m,
          });
        } else {
          await doReact("🧩");
          await unbanGroup(m.from);
          await m.reply(`*${groupName}* has been *Unbanned* Successfully !`);
        }

        break;

      case "setbotmode":
      case "mode":
        if (!text) {
          await doReact("❌");
          return m.reply(
            `Please provide *Self / Private / Public* mode names !\n\n*Example:*\n\n${prefix}mode public`
          );
        }

        
        if (!isCreator) {
          await doReact("❌");
          return Xbot.sendMessage(m.from, {
            text: `_*This is an owner command 😒*_`,
            quoted: m,
          });
        }

        chechbotMode = await getBotMode();

        if (args[0] == "self") {
          if (chechbotMode == "self") {
            await doReact("❌");
            return m.reply(
              `Bot is already in *Self* mode !\n\nOnly *Bot Hoster (Bot number)* can use bot.`
            );
          } else {
            await doReact("🧩");
            await setBotMode("self");
            await m.reply(`Bot has been set to *Self* mode Successfully !`);
          }
        } else if (args[0] == "private") {
          if (chechbotMode == "private") {
            await doReact("❌");
            return m.reply(
              `Bot is already in *Private* mode !\n\nOnly bot *Owners / Mods* can use bot.`
            );
          } else {
            await doReact("🧩");
            await setBotMode("private");
            await m.reply(`Bot has been set to *Private* mode Successfully !`);
          }
        } else if (args[0] == "public") {
          if (chechbotMode == "public") {
            await doReact("❌");
            return m.reply(
              `Bot is already in *Public* mode !\n\nAnyone can use bot.`
            );
          } else {
            await doReact("🧩");
            await setBotMode("public");
            await m.reply(`Bot has been set to *Public* mode Successfully !`);
          }
        } else {
          await doReact("❌");
          return m.reply(
            `Please provide *Self / Private / Public* mode names !\n\n*Example:*\n\n${prefix}mode public`
          );
        }
        break;
//------------------------------------------------------------
        case 'shutdown':
            if (!isCreator) return m.reply("*_This command Is Only For The Owner 🥲_*")
            await doReact("🚀");
            await sleep(3000)
            process.exit()
            break
        case 'restart':
            if (!isCreator) return m.reply("*_This command Is Only For The Owner 🥲_*")
        await doReact("🔁");
            await process.send("reset")
            break
//------------------------------------------------------------------------------
       case 'deletesession':
        case 'delsession':
        case 'cs': {
            if (!isCreator) return m.reply("*_This command Is Only For The Owner 🥲_*")
            fs.readdir("./lib/auth_info_baileys/", async function(err, files) {
                if (err) {
                    console.log('Unable to scan directory: ' + err);
                    return m.reply('Unable to scan directory: ' + err);
                }
                let filteredArray = await files.filter(item => item.startsWith("pre-key") ||
                    item.startsWith("sender-key") || item.startsWith("session-") || item.startsWith("app-state")
                )
                console.log(filteredArray.length);
                /*let teks = `Detected ${filteredArray.length} junk files\n\n`
                if (filteredArray.length == 0) return reply(teks)
                filteredArray.map(function(e, i) {
                    teks += (i + 1) + `${e}\n`
                })
                m.reply(teks)*/
                await sleep(2000)
                m.reply("_*Deleting Trash*_")
                await filteredArray.forEach(function(file) {
                    fs.unlinkSync(`./lib/auth_info_baileys/${file}`)
                });
                await sleep(2000)
                m.reply("_*Successfully deleted all the trash in the session folder*_")
            });
        }
        break 
//-------------------------------------------------------------------------------------------------------
        case 'session':
            if (!isCreator) return m.reply("*_This command Is Only For The Owner 🥲_*")
            m.reply('Wait a moment, currently retrieving your session file')
            let sesi = await fs.readFileSync('./lib/auth_info_baileys/creds.json')
            Xbot.sendMessage(m.from, {
                document: sesi,
                mimetype: 'application/json',
                fileName: 'creds.json'
            }, {
                quoted: m
            })
            break
//------------------------------------------------------------------------------------
      default:
        break;
    }
  },
};
