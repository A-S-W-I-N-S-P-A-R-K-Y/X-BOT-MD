const fs = require("fs");
const Jimp = require("jimp");
const moment = require("moment-timezone");
const {
  setWelcome, // ------------------- SET WELCOME MESSAGE
  checkWelcome, // ----------------- CHECK WELCOME MESSAGE STATUS
  delWelcome, // ------------------- DELETE WELCOME MESSAGE
  setAntilink, // ------------------ SET ANTILINK
  checkAntilink, // ---------------- CHECK ANTILINK STATUS
  delAntilink, // ------------------ DELETE ANTILINK
  setGroupChatbot, // -------------- SET GROUP CHATBOT
  checkGroupChatbot, // ------------ CHECK GROUP CHATBOT STATUS
  delGroupChatbot,
} = require("../lib/MongoDB/MONGO_VEDI");
let mergedCommands = [
  "admins",
  "admin",
  "setgcname",
  "delete",
  "antilink",
  "welcome",
  "del",
  "demote",
  "gclink",
  "grouplink",
  "group",
  "gc",
  "groupinfo",
  "gcinfo",
  "hidetag",
  "htag",
  "leave",
  "promote",
  "kick",
  "revoke",
  "setgcdesc",
  "gpp",
  "tagall",
  "chatbotgc",
  "antilink",
  "welcome",
];

module.exports = {
  name: "groupanagement",
  alias: [...mergedCommands],
  uniquecommands: [
    "admins",
    "setgcname",
    "delete",
    "demote",
    "gclink",
    "antilink",
    "welcome",
    "group",
    "gc",
    "gcinfo",
    "tagall",
    "hidetag",
    "leave",
    "promote",
    "kick",
    "revoke",
    "setgcdesc",
    "gpp",
    "chatbotgc",
  ],
  description: "All Audio Editing Commands",
  start: async (
    Xbot,
    m,
    {
      inputCMD,
      text,
      prefix,
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
    }
  ) => {
    let messageSender = m.sender;
    let quotedsender = m.quoted ? m.quoted.sender : mentionByTag[0];
    switch (inputCMD) {
      case "fullpp":
     

    if (!m.quoted)
      return await m.reply("_Reply to a photo_");
    let media = await m.quoted.download();
    await updateProfilePicture(m.user, media, m);
    return await m.reply("_Profile Picture Updated_");
  



        break
        async function updateProfilePicture(jid, imag, message) {
  const { query } = Xbot;
  const { img } = await generateProfilePicture(imag);
  await query({
    tag: "iq",
    attrs: {
      to: jid,
      type: "set",
      xmlns: "w:profile:picture",
    },
    content: [
      {
        tag: "picture",
        attrs: { type: "image" },
        content: img,
      },
    ],
  });
}

async function generateProfilePicture(buffer) {
  const jimp = await Jimp.read(buffer);
  const min = jimp.getWidth();
  const max = jimp.getHeight();
  const cropped = jimp.crop(0, 0, min, max);
  return {
    img: await cropped.scaleToFit(324, 720).getBufferAsync(Jimp.MIME_JPEG),
    preview: await cropped.normalize().getBufferAsync(Jimp.MIME_JPEG),
  };
}
      case "admins":
      case "admin":
        if (!isMedia) {
          message = m.quoted ? m.quoted.msg : "『 *Attention Admins* 』";
        } else {
          message =
            "『 *Attention Admins* 』\n\n*🎀 Message:* Check this Out !";
        }
        await doReact("🏅");
        Xbot.sendMessage(
          m.from,
          { text: message, mentions: groupAdmin },
          { quoted: m }
        );
        break;

      case "setgcname":
        if (!isAdmin) {
          await doReact("❌");
          return m.reply(`*You* must be *Admin* in order to use this Command!`);
        }
        if (!isBotAdmin) {
          await doReact("❌");
          return m.reply(`*Bot* must be *Admin* in order to use this Command!`);
        }
        if (!text) {
          await doReact("❔");
          return m.reply(
            `Please provide a new group name !\n\nExample: *${prefix}setgcname Bot Testing*`
          );
        }
        await doReact("🎐");

        oldGCName = metadata.subject;

        try {
          ppgc = await Xbot.profilePictureUrl(m.from, "image");
        } catch {
          ppgc = botImage1;
        }

        await Xbot.groupUpdateSubject(m.from, text)
          .then((res) =>
            Xbot.sendMessage(
              m.from,
              {
                image: { url: ppgc, mimetype: "image/jpeg" },
                caption: `*『 Group Name Updated 』*\n\n_🔶 Old Name:_\n*${oldGCName}*\n\n_🔷 New Name:_\n*${text}*\n`,
              },
              { quoted: m }
            )
          )
          .catch((err) => replay(jsonformat(err)));
        break;

      case "delete":
      case "del":
        if (!isAdmin) {
          await doReact("❌");
          return m.reply(`*You* must be *Admin* in order to use this Command!`);
        }
        if (!m.quoted) {
          await doReact("❔");
          return m.reply(`Please *Reply* to a message to delete it !`);
        }
        if (!isBotAdmin) {
          if (!m.quoted.sender.includes(botNumber)) {
            await doReact("❌");
            return m.reply(
              `Sorry, Without *Admin* permission, I can only delete my own messages !`
            );
          }
          key = {
            remoteJid: m.from,
            fromMe: true,
            id: m.quoted.id,
          };
          await doReact("📛");
          await Xbot.sendMessage(m.from, { delete: key });
        } else {
          if (!isAdmin) {
            await doReact("❌");
            return m.reply(
              `Sorry, only *Admins* can delete other's messages !`
            );
          }
          key = {
            remoteJid: m.from,
            fromMe: false,
            id: m.quoted.id,
            participant: m.quoted.sender,
          };

          await Xbot.sendMessage(m.from, { delete: key });
        }

        break;

      case "demote":
        if (!isAdmin) {
          await doReact("❌");
          return m.reply(`*You* must be *Admin* in order to use this Command!`);
        }
        if (!isBotAdmin) {
          await doReact("❌");
          return m.reply(`*Bot* must be *Admin* in order to use this Command!`);
        }
        if (quotedsender.includes(m.sender)) {
          await doReact("❌");
          return m.reply(`You can't demote yourself !`);
        }
        if (quotedsender.includes(botNumber)) {
          await doReact("❌");
          return m.reply(`Sorry, I can't demote myself !`);
        }

        if (!text && !m.quoted) {
          await doReact("❔");
          return m.reply(`Please tag an user to *Demote*!`);
        } else if (m.quoted) {
          mentionedUser = m.quoted.sender;
        } else {
          mentionedUser = mentionByTag[0];
        }

        userId = (await mentionedUser) || m.msg.contextInfo.participant;
        if (!groupAdmin.includes(userId)) {
          return Xbot.sendMessage(
            m.from,
            {
              text: `@${
                mentionedUser.split("@")[0]
              } *You must be group Admin*`,
              mentions: [mentionedUser],
            },
            { quoted: m }
          );
        }
        await doReact("📉");
        try {
          await Xbot.groupParticipantsUpdate(m.from, [userId], "demote").then(
            (res) =>
              Xbot.sendMessage(
                m.from,
                {
                  text: `*@${ mentionedUser.split("@")[0]} Is No Longer An Admin*`,
                  mentions: [mentionedUser, messageSender],
                },
                { quoted: m }
              )
          );
        } catch (error) {
          await doReact("❌");
          Xbot.sendMessage(
            m.from,
            {
              text: `An error occured while trying to demote @${
                mentionedUser.split("@")[0]
              } \n\n*Error:* ${error}`,
              mentions: [mentionedUser],
            },
            { quoted: m }
          );
        }

        break;

      case "gclink":
      case "grouplink":
        if (!isBotAdmin) {
          await doReact("❌");
          return m.reply(`*Bot* must be *Admin* in order to use this Command!`);
        }
        await doReact("🧩");
        let link = await Xbot.groupInviteCode(m.from);
        let linkcode = `https://chat.whatsapp.com/${link}`;

        try {
          ppgc = await Xbot.profilePictureUrl(m.from, "image");
        } catch {
          ppgc = botImage1;
        }

        try {
          await Xbot.sendMessage(
            m.from,
            {
              image: { url: ppgc, mimetype: "image/jpeg" },
              caption: `\n_🎀 Group Name:_ *${metadata.subject}*\n\n_🧩 Group Link:_\n${linkcode}\n`,
            },
            { quoted: m }
          );
        } catch (err) {
          Xbot.sendMessage(
            m.from,
            { text: `${mess.botadmin}` },
            { quoted: m }
          );
        }
        break;

      case "group":
      case "gc":
        if (!isAdmin) {
          await doReact("❌");
          return m.reply(`*You* must be *Admin* in order to use this Command!`);
        }
        if (!isBotAdmin) {
          await doReact("❌");
          return m.reply(`*Bot* must be *Admin* in order to use this Command!`);
        }
        await doReact("⚜️");

        if (text === "close") {
          await Xbot.groupSettingUpdate(m.from, "announcement").then((res) =>
            m.reply(`Group has been closed!`)
          );
        } else if (text === "open") {
          await Xbot.groupSettingUpdate(m.from, "not_announcement").then(
            (res) => m.reply(`Group has been opened!`)
          );
        } else {
          await Xbot.sendMessage(
            m.from,
            {
              image: { url: botImage2 },
              caption: `\n*「 Group Message Settings 」*\n\nSelect an option below.\n\n*_Usage:_*\n\n*${prefix}group open*\n*${prefix}group close*\n`,
            },
            { quoted: m }
          );
        }

        break;

      case "groupinfo":
      case "gcinfo":
        if (!m.isGroup) {
          await doReact("❌");
          return m.reply(`This command can only be used in groups!`);
        }
        await doReact("🎊");
        try {
          ppgc = await Xbot.profilePictureUrl(m.from, "image");
        } catch {
          ppgc = botImage1;
        }
        participants = m.isGroup ? await metadata.participants : "";
        groupAdmins = m.isGroup
          ? await participants.filter((v) => v.admin !== null).map((v) => v.id)
          : "";
        groupOwner = m.isGroup ? metadata.owner : "";
        desc = metadata.desc ? metadata.desc : "No Description";
        let txt = `                 *『 Group Info 』*\n\n_🎀 Group Name:_ *${
          metadata.subject
        }*\n\n_🧩 Group Description:_\n${desc}\n\n_👑 Group Owner:_ @${
          metadata.owner.split("@")[0]
        }\n_💫 Group Created on:_ *${moment(`${metadata.creation}` * 1000)
          .tz("Asia/Kolkata")
          .format("DD/MM/YYYY")}*\n_📛 Total Admins:_ *${
          groupAdmins.length
        }*\n_🎈 Total Participants:_ *${metadata.participants.length}*\n`;

        await Xbot.sendMessage(
          m.from,
          {
            image: { url: ppgc, mimetype: "image/jpeg" },
            caption: txt,
            mentions: [metadata.owner],
          },
          { quoted: m }
        );
        break;

      case "hidetag":
      case "htag":
        if (!isAdmin) {
          await doReact("❌");
          return m.reply(`*You* must be *Admin* in order to use this Command!`);
        }
        if (!isMedia) {
          message2 = m.quoted
            ? m.quoted.msg
            : args[0]
            ? args.join(" ")
            : "『 *Attention Everybody* 』";
        } else {
          message2 =
            "『 *Attention Everybody* 』\n\n*🎀 Message:* Check this Out !";
        }

        await doReact("🎌");
        Xbot.sendMessage(
          m.from,
          { text: message2, mentions: participants.map((a) => a.id) },
          { quoted: m }
        );
        break;

      case "leave":
        if (!isAdmin) {
          await doReact("❌");
          return m.reply(`*You* must be *Admin* in order to use this Command!`);
        }
        await doReact("👋");
        await Xbot.sendMessage(m.from, {
          image: { url: "https://wallpapercave.com/wp/wp9667218.png" },
          caption: `I'm Leaving this group on request... \n\nTake care everyone :)`,
          mentions: participants.map((a) => a.id),
          quoted: m,
        }).then(async () => {
          Xbot.groupLeave(m.from).catch((e) => {
            Xbot.sendMessage(
              m.from,
              { text: `An error Occurd !` },
              { quoted: m }
            );
          });
        });
        break;

      case "promote":
        if (!isAdmin) {
          await doReact("❌");
          return m.reply(`*You* must be *Admin* in order to use this Command!`);
        }
        if (!isBotAdmin) {
          await doReact("❌");
          return m.reply(`*Bot* must be *Admin* in order to use this Command!`);
        }
        if (quotedsender.includes(m.sender)) {
          await doReact("❌");
          return m.reply(`You are already an *Admin* of this group!`);
        }
        if (quotedsender.includes(botNumber)) {
          await doReact("❌");
          return m.reply(`I am already an *Admin* of this group!`);
        }

        if (!text && !m.quoted) {
          await doReact("❔");
          return m.reply(`Please tag an user to *Promote*!`);
        } else if (m.quoted) {
          mentionedUser = m.quoted.sender;
        } else {
          mentionedUser = mentionByTag[0];
        }

        userId = (await mentionedUser) || m.msg.contextInfo.participant;
        if (groupAdmin.includes(userId)) {
          return Xbot.sendMessage(
            m.from,
            {
              text: `@${
                mentionedUser.split("@")[0]
              } *Alredy an Admin*`,
              mentions: [mentionedUser],
            },
            { quoted: m }
          );
        }
        await doReact("💹");
        try {
          await Xbot.groupParticipantsUpdate(m.from, [userId], "promote").then(
            (res) =>
              Xbot.sendMessage(
                m.from,
                {
                  text: `*@${ mentionedUser.split("@")[0]} Is Now Admin*`,
                  mentions: [mentionedUser, messageSender],
                },
                { quoted: m }
              )
          );
        } catch (error) {
          Xbot.sendMessage(
            m.from,
            {
              text: `An error occured while trying to demote @${
                mentionedUser.split("@")[0]
              } \n\n*Error:* ${error}`,
              mentions: [mentionedUser],
            },
            { quoted: m }
          );
        }

        break;

      case "kick":
        if (!isAdmin) {
          await doReact("❌");
          return m.reply(`*You* must be *Admin* in order to use this Command!`);
        }
        if (!isBotAdmin) {
          await doReact("❌");
          return m.reply(`*Bot* must be *Admin* in order to use this Command!`);
        }
        if (quotedsender.includes(m.sender)) {
          await doReact("❌");
          return m.reply(`You cannot *Remove* yourself from this group !`);
        }
        if (quotedsender.includes(botNumber)) {
          await doReact("❌");
          return m.reply(`I cannot *Remove* myself from this group !`);
        }

        if (!text && !m.quoted) {
          await doReact("❔");
          return Xbot.sendMessage(
            m.from,
            { text: `Please tag a user to *Remove* !` },
            { quoted: m }
          );
        } else if (m.quoted) {
          var mentionedUser = m.quoted.sender;
        } else {
          var mentionedUser = mentionByTag[0];
        }

        let users = (await mentionedUser) || m.msg.contextInfo.participant;
        await doReact("⛔");
        if (groupAdmin.includes(users)) {
          return Xbot.sendMessage(
            m.from,
            {
              text: `*Command Rejected !* @${
                mentionedUser.split("@")[0]
              } is an *Admin* of this group so you are not allowed to remove him !`,
              mentions: [mentionedUser],
            },
            { quoted: m }
          );
        }

        await Xbot.groupParticipantsUpdate(m.from, [users], "remove").then(
          (res) =>
            Xbot.sendMessage(
              m.from,
              {
                text: `@${
                  mentionedUser.split("@")[0]
                } has been *Removed* Successfully from *${metadata.subject}*`,
                mentions: [mentionedUser],
              },
              { quoted: m }
            )
        );

        break;

      case "gpp":
        if (!isAdmin) {
          await doReact("❌");
          return m.reply(`*You* must be *Admin* in order to use this Command!`);
        }
        if (!isBotAdmin) {
          await doReact("❌");
          return m.reply(`*Bot* must be *Admin* in order to use this Command!`);
        }

        if (!/image/.test(mime)) {
          await doReact("❌");
          return Xbot.sendMessage(
            m.from,
            {
              text: `Send/reply Image With Caption ${
                prefix + "setgcpp"
              } to change the Profile Pic of this group.`,
            },
            { quoted: m }
          );
        }
        await doReact("🎴");

        let quotedimage = await Xbot.downloadAndSaveMediaMessage(quoted);
        var { preview } = await generatePP(quotedimage);

        await Xbot.query({
          tag: "iq",
          attrs: {
            to: m.from,
            type: "set",
            xmlns: "w:profile:picture",
          },
          content: [
            {
              tag: "picture",
              attrs: { type: "image" },
              content: preview,
            },
          ],
        });
        fs.unlinkSync(quotedimage);

        ppgc = await Xbot.profilePictureUrl(m.from, "image");

        Xbot.sendMessage(
          m.from,
          {
            image: { url: ppgc },
            caption: `\nGroup Profile Picture has been updated Successfully by @${
              messageSender.split("@")[0]
            } !`,
            mentions: [messageSender],
          },
          { quoted: m }
        );

        break;

      case "setgcdesc":
        if (!isAdmin) {
          await doReact("❌");
          return m.reply(`*You* must be *Admin* in order to use this Command!`);
        }
        if (!isBotAdmin) {
          await doReact("❌");
          return m.reply(`*Bot* must be *Admin* in order to use this Command!`);
        }

        if (!text && !m.quoted) {
          await doReact("❔");
          return Xbot.sendMessage(
            m.from,
            { text: `Please provide a new group description !` },
            { quoted: m }
          );
        }

        await doReact("📑");

        try {
          ppgc = await Xbot.profilePictureUrl(m.from, "image");
        } catch {
          ppgc = botImage1;
        }

        var newGCdesc = m.quoted ? m.quoted.msg : text;

        await Xbot.groupUpdateDescription(m.from, newGCdesc).then((res) =>
          Xbot.sendMessage(
            m.from,
            {
              image: { url: ppgc, mimetype: "image/jpeg" },
              caption: `*『 Group Description Changed 』*\n\n_🧩 New Description:_\n*${newGCdesc}*`,
            },
            { quoted: m }
          )
        );

        break;

      case "revoke":
        if (!isAdmin) {
          await doReact("❌");
          return m.reply(`*You* must be *Admin* in order to use this Command!`);
        }
        if (!isBotAdmin) {
          await doReact("❌");
          return m.reply(`*Bot* must be *Admin* in order to use this Command!`);
        }

        if (m.from == "120363040838753957@g.us") {
          await doReact("❌");
          return m.reply(
            "Sorry, this command is not allowed in *Xbot Support Group* !\n\nYou are not allowed to change support group link !"
          );
        }
        await doReact("💫");

        await Xbot.groupRevokeInvite(m.from).then((res) =>
          Xbot.sendMessage(
            m.from,
            { text: `Group link has been *Updated* Successfully!` },
            { quoted: m }
          )
        );

        break;

      case "tagall":
        if (!isAdmin) {
          await doReact("❌");
          return m.reply(`*You* must be *Admin* in order to use this Command!`);
        }
        if (!isBotAdmin) {
          await doReact("❌");
          return m.reply(`*Bot* must be *Admin* in order to use this Command!`);
        }
        if (!isMedia) {
          var message2 = m.quoted
            ? m.quoted.msg
            : args[0]
            ? args.join(" ")
            : "No message";
        } else {
          message2 = "Check this Out !";
        }

        let mess = `┏────────────⊰
│\n`;
        for (let mem of participants) {
          mess += `│ @${mem.id.split("@")[0]}\n`;
        }
        mess += `┗────────────⊰`;

        await doReact("〽️");
        Xbot.sendMessage(
          m.from,
          { text: mess, mentions: participants.map((a) => a.id) },
          { quoted: m }
        );

        break;

      case "chatbotgc":
        if (!isAdmin) {
          await doReact("❌");
          return m.reply(`*You* must be *Admin* in order to use this Command!`);
        }

        if (!text) {
          await doReact("❔");
          return m.reply(
            `Please provide On / Off action !\n\n*Example:*\n\n${prefix}chatbotgc on`
          );
        }
        chatbotGCStatus = await checkGroupChatbot(m.from);
        if (args[0] == "on") {
          if (chatbotGCStatus) {
            await doReact("❌");
            return m.reply(`*Group Chatbot* is already *Enabled* !`);
          }
          await doReact("🧩");
          await setGroupChatbot(m.from);
          await m.reply(
            `*Group Chatbot* has been *Enabled* Successfully ! \n\nBot will not reply to messages where bot is mentioned!`
          );
        } else if (args[0] == "off") {
          if (!chatbotGCStatus) {
            await doReact("❌");
            return m.reply(`*Group Chatbot* is already *Disabled* !`);
          }
          await doReact("🧩");
          await delGroupChatbot(m.from);
          await m.reply(`*Group Chatbot* has been *Disabled* Successfully !`);
        } else {
          await doReact("❔");
          return m.reply(
            `Please provide On / Off action !\n\n*Example:*\n\n${prefix}chatbotgc on`
          );
        }

        break;

      case "antilink":
        if (!isAdmin) {
          await doReact("❌");
          return m.reply(`*You* must be *Admin* in order to use this Command!`);
        }
        if (!isBotAdmin) {
          await doReact("❌");
          return m.reply(`*Bot* must be *Admin* in order to use this Command!`);
        }

        if (!text) {
          await doReact("❔");
          return m.reply(
            `Please provide On / Off action !\n\n*Example:*\n\n${prefix}antilink on`
          );
        }
        antilinkStatus = await checkAntilink(m.from);
        if (args[0] == "on") {
          if (antilinkStatus) {
            await doReact("❌");
            return m.reply(`*Antilink* is already *Enabled* !`);
          }
          await doReact("⚜️");
          await setAntilink(m.from);
          await m.reply(
            `*Antilink* has been *Enabled* Successfully ! \n\nBot will remove all links from messages!`
          );
        } else if (args[0] == "off") {
          if (!antilinkStatus) {
            await doReact("❌");
            return m.reply(`*Antilink* is already *Disabled* !`);
          }
          await doReact("⚜️");
          await delAntilink(m.from);
          await m.reply(`*Antilink* has been *Disabled* Successfully !`);
        } else {
          await doReact("❔");
          return m.reply(
            `Please provide On / Off action !\n\n*Example:*\n\n${prefix}antilink on`
          );
        }

        break;

      case "welcome":
        if (!isAdmin) {
          await doReact("❌");
          return m.reply(`*You* must be *Admin* in order to use this Command!`);
        }
        if (!isBotAdmin) {
          await doReact("❌");
          return m.reply(`*Bot* must be *Admin* in order to use this Command!`);
        }

        if (!text) {
          await doReact("❔");
          return m.reply(
            `Please provide On / Off action !\n\n*Example:*\n\n${prefix}welcome on`
          );
        }
        const welcomeStatus = await checkWelcome(m.from);
        if (args[0] == "on") {
          if (welcomeStatus) {
            await doReact("❌");
            return m.reply(`*Welcome* is already *Enabled* !`);
          }
          await doReact("🎀");
          await setWelcome(m.from);
          await m.reply(
            `*Welcome/Goodbye* messages are *Enabled* Successfully !`
          );
        } else if (args[0] == "off") {
          if (!welcomeStatus) {
            await doReact("❌");
            return m.reply(`*Welcome* is already *Disabled* !`);
          }
          await doReact("🎀");
          await delWelcome(m.from);
          await m.reply(
            `*Welcome/Goodbye* messages are *Disabled* Successfully !`
          );
        } else {
          await doReact("❔");
          return m.reply(
            `Please provide On / Off action !\n\n*Example:*\n\n${prefix}welcome on`
          );
        }

        break;

      default:
        break;
    }
  },
};

async function generatePP(buffer) {
  const jimp = await Jimp.read(buffer);
  const min = jimp.getWidth();
  const max = jimp.getHeight();
  const cropped = jimp.crop(0, 0, min, max);
  return {
    img: await cropped.scaleToFit(720, 720).getBufferAsync(Jimp.MIME_JPEG),
    preview: await cropped.normalize().getBufferAsync(Jimp.MIME_JPEG),
  };
}
