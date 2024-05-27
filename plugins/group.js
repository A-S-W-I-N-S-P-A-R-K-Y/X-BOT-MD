const {
    Sparky,
    
    isPublic
} = require("../lib/plugins.js");
const font = require("@viper-x/fancytext");


Sparky(
    {
        name: "tag",
        fromMe: true,
        desc: "Tags a content",
        category: "group"
    },
    async ({
        m, client, args
    }) => {
        arg = m.quoted || args
    if (!arg) return m.reply("_Enter or reply to a message_");
    //if (!m.isGroup) return;
    const { participants } = await client.groupMetadata(m.jid);
        let jids = await participants.map((a) => a.id)
    m.forwardMessage(m.jid, arg , {contextInfo: {
      mentionedJid: jids
    }});
  }
);

Sparky(
    {
        name: "invite",
        fromMe: isPublic,
        desc: "Share's Group invitation link",
        category: "group"
    },
    async ({
        m, client, args
    }) => {

        if (!await m.isAdmin(client.user.id)) return m.reply("Admin access not conferred.")
        if (!await m.isAdmin(m.sender)) return m.reply("Only for authorized administrators.")
        let code = await client.groupInviteCode(m.jid)
        return m.reply('https://chat.whatsapp.com/' + code)
    })

Sparky(
    {
        name: "mute",
        fromMe: isPublic,
        desc: "Mutes the group.",
        category: "group"
    },
    async ({
        m, client, args
    }) => {

        if (!await m.isAdmin(client.user.id)) return m.reply("Admin access not conferred.")
        if (!await m.isAdmin(m.sender)) return m.reply("Only for authorized administrators.")
        await client.groupSettingUpdate(m.jid, 'announcement');
        return await m.reply("Messages restricted to group admins.");
    })

Sparky(
    {
        name: "unmute",
        fromMe: isPublic,
        desc: "Unmutes the group",
        category: "group"
    },
    async ({
        m, client, args
    }) => {

        if (!await m.isAdmin(client.user.id)) return m.reply("Admin access not conferred.")
        if (!await m.isAdmin(m.sender)) return m.reply("Only for authorized administrators.")
        await client.groupSettingUpdate(m.jid, 'not_announcement');
        return await m.reply("Messages Unrestricted.");
    })

Sparky(
    {
        name: "promote",
        fromMe: isPublic,
        desc: "Promotes a user to admin",
        category: "group"
    },
    async ({
        m, client, args
    }) => {
        try {
            if (!await m.isAdmin(client.user.id)) return m.reply("Admin access not conferred.")
            if (!await m.isAdmin(m.sender)) return m.reply("Only for authorized administrators.")

            if (!(args || m.quoted)) return m.reply("Mention a user.")
            if (args) {
                var user = args.replace("@", "") + '@s.whatsapp.net';
            } else if (m.quoted.sender) {
                var user = m.quoted.sender;
            } else if (m.mentionedJid) {
                var user = args + '@s.whatsapp.net';
            }

            if (await m.isAdmin(user) === true) return m.reply("The user is currently in an admin role.");

            await client.groupParticipantsUpdate(m.jid, [user], "promote");
            m.sendMsg(m.jid , `@${user.split("@")[0]} promoted to admin role.`, { mentions : [user] , quoted : m})
        } catch (e) {
            console.log(e);
        }

    })

Sparky(
    {
        name: "demote",
        fromMe: isPublic,
        desc: "Demotes a user from admin",
        category: "group"
    },
    async ({
        m, client, args
    }) => {
        try {

            if (!await m.isAdmin(client.user.id)) return m.reply("Admin access not conferred.")
            if (!await m.isAdmin(m.sender)) return m.reply("Only for authorized administrators.")
            if (!(args || m.quoted)) return m.reply("Mention a user.")
            if (args) {
                var user = args.replace("@", "") + '@s.whatsapp.net';
            } else if (m.quoted.sender) {
                var user = m.quoted.sender;
            } else if (m.mentionedJid) {
                var user = args + '@s.whatsapp.net';
            }

            if (!await m.isAdmin(user)) return m.reply("Admin access not extended to the user.");

            await client.groupParticipantsUpdate(m.jid, [user], "demote");
            m.sendMsg(m.jid , `@${user.split("@")[0]} demoted from admin role!`, { mentions : [user] , quoted : m })

        } catch (e) {
            console.log(e);
        }

    })
    
