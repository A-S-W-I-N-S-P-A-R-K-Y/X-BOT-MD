const {
    SUDO
} = require('../config.js');
const {
    toAudio,
    getBuffer
} = require("../lib/functions.js");
const {
    Sparky,
    commands,
    isPublic
} = require("../lib/plugins.js");


 Sparky({
    on: "text",
    fromMe: isPublic,
},
    async({
        m, client, args
    })=> {

        let sudo = SUDO.split(",")
        var audios = "https://i.imgur.com/koShroP.mp4,https://i.imgur.com/jp56U2U.mp4,https://i.imgur.com/Bn3LRsC.mp4,https://i.imgur.com/8IbgdWB.mp4,https://i.imgur.com/MYKKVWi.mp4"
        var image = "https://i.imgur.com/ICAw6Vd.jpeg,https://i.imgur.com/E6oGes7.jpeg,https://i.imgur.com/E6oGes7.jpeg,"

        for (any in sudo)
            if (args.includes(sudo[any])) {
            const imgsplit = image.split(",")
            const imgrandom = imgsplit[Math.floor(Math.random() * imgsplit.length)]
            const split = audios.split(",")
            const aud = split[Math.floor(Math.random() * split.length)]
            const audio = await getBuffer(aud)
            let image1 = await getBuffer(imgrandom)
            var res = await toAudio(audio, 'mp4')
            client.sendMessage(m.jid, {
                audio: res,
                mimetype: 'audio/mpeg',
                ptt: true,
                waveform: [00, 99, 00, 99, 00, 99, 00, 99, 00],
                contextInfo: {
                    "forwardingScore": 999,
                    "isForwarded": true,
                    externalAdReply: {
                        title: "✪⏤͟͞★⃝ꪶ ѕᴩ⃪ᴀʀ⃪ⲕʏ𖥘✪͜͡➺",
                        body: "TEAM EX-BOT-Z 🗿",
                        mediaType: 2,
                        thumbnail: image1,
                        mediaUrl: 'https://wa.me/917012984396',
                        sourceUrl: 'https://wa.me/917012984396',
                        showAdAttribution: true
                    }
                }
            }, {
                quoted: m
            })

        }

    })
