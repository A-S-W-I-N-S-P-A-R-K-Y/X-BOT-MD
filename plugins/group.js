const font = require("@viper-x/fancytext");
const { Sparky,
       isPublic 
      } = require("../lib/plugins.js");
const { isAdmin } = require("../lib/functions.js");


Sparky({
       name: "mute",
       fromMe: true, 
       category: "group", 
       desc: "It will change the group settings to only admins can send message.",
},
async ({ m, client }) => {
       try {
              if(!m.isGroup) {
                     return await m.reply("*_This command can only be used in group!_*");
              }
              await client.groupSettingUpdate(m.jid, 'announcement');
              return await m.reply("*_Group muted!_*");
       } catch (e) {
              console.log(e)
                     await m.reply(`*_I'm not admin!_*`);
       }
});

Sparky({
       name: "unmute",
       fromMe: true,
       category: "group",
       desc: "It will change the group settings to everyone can send message.",
},
    async ({ m, client }) => {
           try {
                  if(!m.isGroup) {
                         return await m.reply("*_This command can only be used in group!_*");
                  }
                  await client.groupSettingUpdate(m.jid, 'not_announcement');
                  return await m.reply("*_Group unmuted!_*");
           } catch (e) {
                  await m.reply(`*_I'm not admin!_*`);
           }
});

Sparky({
	name: 'left',
	type: 'group',
	desc: "",
	fromMe: true
}, async ({m, client}) => {
       if(!m.isGroup) {
                         return await m.reply("*_This command can only be used in group!_*");
       }
	await client.groupLeave(m.jid)
});
