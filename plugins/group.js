const {
    Sparky,
    commands,
    isPublic
} = require("../lib/plugins.js");
const font = require("@viper-x/fancytext");

/*
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

        if (!await m.isAdmin(client.user.id)) return m.reply("_Admin access not conferred._")
        if (!await m.isAdmin(m.sender)) return m.reply("_Only for authorized administrators._")
        let code = await client.groupInviteCode(m.jid)
        return m.reply('https://chat.whatsapp.com/' + code)
    })
*/
Sparky(
    {
        name: "mute",
        fromMe: true,
        desc: "Mutes the group.",
        category: "group"
    },
    async ({
        m, client, args
    }) => {

        if (!m.isAdmin) return m.reply("_Admin access not conferred._")
        await client.groupSettingUpdate(m.jid, 'announcement');
        return await m.reply("_Messages restricted to group admins._");
    })

Sparky(
    {
        name: "unmute",
        fromMe: true,
        desc: "Unmutes the group",
        category: "group"
    },
    async ({
        m, client, args
    }) => {

        if (!m.isAdmin) return m.reply("_Admin access not conferred._")
        await client.groupSettingUpdate(m.jid, 'not_announcement');
        return await m.reply("_Messages Unrestricted._");
    })

Sparky(
    {
        name: "promote",
        fromMe: true,
        desc: "Promotes a user to admin",
        category: "group"
    },
    async ({
        m, client, args
    }) => {
        try {
            if (!m.isAdmin) return m.reply("_Admin access not conferred._")
            if (!(args || m.quoted)) return m.reply("_Mention a user._")
            if (args) {
                var user = args.replace("@", "") + '@s.whatsapp.net';
            } else if (m.quoted.sender) {
                var user = m.quoted.sender;
            } else if (m.mentionedJid) {
                var user = args + '@s.whatsapp.net';
            }

            if (!m.isAdmin(user) === true) return m.reply("_The user is currently in an admin role._");

            await client.groupParticipantsUpdate(m.jid, [user], "promote");
            m.sendMsg(m.jid , `_@${user.split("@")[0]} promoted to admin role._`, { mentions : [user] , quoted : m})
        } catch (e) {
            console.log(e);
        }

    })

Sparky(
    {
        name: "demote",
        fromMe: true,
        desc: "Demotes a user from admin",
        category: "group"
    },
    async ({
        m, client, args
    }) => {
        try {

            if (!m.isAdmin) return m.reply("_Admin access not conferred._")
            if (!(args || m.quoted)) return m.reply("_Mention a user._")
            if (args) {
                var user = args.replace("@", "") + '@s.whatsapp.net';
            } else if (m.quoted.sender) {
                var user = m.quoted.sender;
            } else if (m.mentionedJid) {
                var user = args + '@s.whatsapp.net';
            }

            if (!m.isAdmin(user)) return m.reply("_Admin access not extended to the user._");

            await client.groupParticipantsUpdate(m.jid, [user], "demote");
            m.sendMsg(m.jid , `_@${user.split("@")[0]} demoted from admin role!_`, { mentions : [user] , quoted : m })

        } catch (e) {
            console.log(e);
        }

    });

Sparky({
	name : "left",
	fromMe: true,
	category : "group",
	desc: "",
}, async ({m, client}) => {
       if(!m.isGroup) {
                         return await m.reply("*_This command can only be used in group!_*");
       }
	await client.groupLeave(m.jid)
});


Sparky(
    {
        name: "invite",
        fromMe: true,
        desc: "Mutes the group.",
        category: "group"
    },
    async ({
        m, client, args
    }) => {

        if (!m.isAdmin) return m.reply("_Admin access not conferred._")
const response = await client.groupInviteCode(m.jid)
await m.reply(`_https://chat.whatsapp.com/${response}_`)
    }
	);

Sparky(
    {
        name: "revoke",
        fromMe: true,
        desc: "Mutes the group.",
        category: "group"
    },
    async ({
        m, client, args
    }) => {

        if (!m.isAdmin) return m.reply("_Admin access not conferred._")
       await client.groupRevokeInvite(m.jid)
await m.reply("_The Invite Was Revoked!_")
    }
	);

Sparky(
    {
        name: "join",
        fromMe: true,
        desc: "Mutes the group.",
        category: "group"
    },
    async ({
        m, client, args
    }) => {

        if (!m.isAdmin) return m.reply("_Admin access not conferred._")    
    var rgx = /^(https?:\/\/)?chat\.whatsapp\.com\/(?:invite\/)?([a-zA-Z0-9_-]{22})$/
    if (!args || !rgx.test(args)) return await m.reply("_Need group link_")
    var res = await client.groupAcceptInvite(args.split("/")[3])
    if (!res) return await m.reply("_Invalid Group Link!_")
    if (res) return await m.reply("_Joined!_")
    }
	);
