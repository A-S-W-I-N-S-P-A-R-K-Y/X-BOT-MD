const {
    Sparky,
    isPublic
} = require("../lib/plugins.js");

const {
    updatefullpp
} = require("../lib/sub.js");

Sparky(
    {
        name: "fullpp",
        fromMe: true,
        category: "sudo",
        desc: "fullpp"
    }, async ({
            m, client, args
        }) => {
        try {
            if (!m.quoted || (!m.quoted.message.imageMessage))
                return m.reply("_Reply to an Image_");
            let media = await m.quoted.download();
            await updatefullpp(m.user, media, client);
            return await m.reply("_Profile Picture Updated_");
        } catch (e) {
            console.log(e)
        }
    })
