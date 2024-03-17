
const {
    Sparky,
    isPublic
} = require("../lib/plugins.js");
const fs = require('fs')
const {
    tmpdir
} = require("os");
const {
    toVideo,
    imgurUpload
} = require("../lib/functions.js");

Sparky(
    {
        name: "url",
        fromMe: isPublic,
        category: "tools",
        desc: "upload media to imgur and returns Url"
    },
    async ({
        m, client, args
    }) => {

        if (!m.quoted) {
            return m.reply('_Reply to an Image/Video/Audio_');
        }

        let buff = await m.quoted.download()

        if (buff.length > 10 * 1024 * 1024)
            return m.reply('_Reply with Filesize under 10 MegaBytes_');

        let loading = await m.sendMsg(m.jid, "_Uploading..._")

        let {
            data,
            mime
        } = await m.getFile(buff);

        const size = (data.length / (1024 * 1024)).toFixed(2);

        let tmpInput;

        if (mime.includes('audio')) {
            const tmpInput = `${tmpdir()}/imgur.mp4`
            await delay (3000)
            const aud = await toVideo(data);
            fs.writeFileSync(tmpInput, aud)
        } else {
            tmpInput = `${tmpdir()}/imgur.${mime.split("/")[1]}`
            fs.writeFileSync(tmpInput, data)
        }

        try {
            const link = await imgurUpload(tmpInput);
            m.sendMsg(m.jid, `${link}`, {
                edit: loading.key
            })
        } catch {
            m.sendMsg(m.jid, `_Error_`, {
                edit: loading.key
            })
        }

    })
