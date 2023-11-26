const fs = require("fs");
const fetch = require("node-fetch");
const axios = require("axios");
const { Sticker, StickerTypes } = require("wa-sticker-formatter");
let { TelegraPh } = require("../lib/Uploader.js");
const {
  STICKER_DATA
} = require('../config.js')
const {
  fetchJson,
  getBuffer,
  GIFBufferToVideoBuffer,
} = require("../lib/Function2.js");
let mergedCommands = [
  "sticker",
  "s",
  "steal",
  "take",
  "stickercrop",
  "scrop",
  "smeme",
  "stickermeme",
  "quote",
  "q",
  "emojimix",
];

module.exports = {
  name: "stickerformat",
  alias: [...mergedCommands],
  uniquecommands: [
    "sticker",
    "take",
    "scrop",
    "smeme",
    "stickermeme",
    "q",
    "emojimix",
  ],
  description: "All Sticker formatting Commands",
  start: async (
    Xbot,
    m,
    {
      inputCMD,
      text,
      pushName,
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
    switch (inputCMD) {
      case "s":
      case "sticker":
        if (/image/.test(mime)) {
          await doReact("🔖");
          let mediaMess = await quoted.download();
          let stickerMess = new Sticker(mediaMess, {
            pack: STICKER_DATA.split(";")[0],
            author: STICKER_DATA.split(";")[1],
            type: StickerTypes.FULL,
            categories: ["🤩", "🎉"],
            id: "12345",
            quality: 70,
            background: "transparent",
          });
          const stickerBuffer = await stickerMess.toBuffer();
          Xbot.sendMessage(m.from, { sticker: stickerBuffer }, { quoted: m });
        } else if (/video/.test(mime)) {
          await doReact("🔖");
          let mediaMess = await quoted.download();
          if ((quoted.msg || quoted).seconds > 15) {
            await doReact("❌");
            return Xbot.sendMessage(
              m.from,
              { text: "Please send video less than 15 seconds." },
              { quoted: m }
            );
          }
          let stickerMess = new Sticker(mediaMess, {
            pack: STICKER_DATA.split(";")[0],
            author: STICKER_DATA.split(";")[1],
            type: StickerTypes.FULL,
            categories: ["🤩", "🎉"],
            id: "12345",
            quality: 70,
            background: "transparent",
          });
          const stickerBuffer2 = await stickerMess.toBuffer();
          Xbot.sendMessage(m.from, { sticker: stickerBuffer2 }, { quoted: m });
        } else {
          await doReact("❌");
          m.reply(
            `Please mention an *image/video* and type *${prefix}s* to create sticker.`
          );
        }
        break;

      case "steal":
      case "take":
        if (!m.quoted) {
          await doReact("❔");
          return m.reply(`Please meantion a sticker to steal it.`);
        }
        await doReact("🀄️");
        if (!args.join(" ")) {
          var packName = pushName;
          var authorName = pushName;
        } else if (args.join(" ").includes(",")) {
          var packName = args.join(" ").split(",")[0];
          var authorName = args.join(" ").split(",")[1];
        } else {
          var packName = args.join(" ");
          var authorName = args.join(" ");
        }
        if (/webp/.test(mime)) {
          let mediaMess = await quoted.download();
          let stickerMess = new Sticker(mediaMess, {
            pack: packName,
            author: authorName,
            type: StickerTypes.FULL,
            categories: ["🤩", "🎉"],
            id: "12345",
            quality: 70,
            background: "transparent",
          });
          const stickerBuffer = await stickerMess.toBuffer();
          Xbot.sendMessage(m.from, { sticker: stickerBuffer }, { quoted: m });
        } else {
          await doReact("❌");
          m.reply(
            `Please mention a *Sticker* and type *${prefix}steal <packname , authorname>* to create sticker with your name.`
          );
        }

        break;

      case "scrop":
      case "stickercrop":
        if (/image/.test(mime)) {
          await doReact("🃏");
          let mediaMess = await quoted.download();
          let stickerMess = new Sticker(mediaMess, {
            pack: packname,
            author: pushName,
            type: StickerTypes.CROPPED,
            categories: ["🤩", "🎉"],
            id: "12345",
            quality: 70,
            background: "transparent",
          });
          const stickerBuffer = await stickerMess.toBuffer();
          Xbot.sendMessage(m.from, { sticker: stickerBuffer }, { quoted: m });
        } else if (/video/.test(mime)) {
          await doReact("🃏");
          let mediaMess = await quoted.download();
          if ((quoted.msg || quoted).seconds > 15) {
            await doReact("❌");
            return m.reply("Please send video less than 15 seconds.");
          }
          let stickerMess = new Sticker(mediaMess, {
            pack: packname,
            author: pushName,
            type: StickerTypes.CROPPED,
            categories: ["🤩", "🎉"],
            id: "12345",
            quality: 70,
            background: "transparent",
          });
          const stickerBuffer2 = await stickerMess.toBuffer();
          Xbot.sendMessage(m.from, { sticker: stickerBuffer2 }, { quoted: m });
        } else {
          await doReact("❌");
          m.reply(
            `Please mention an *imade/video* and type *${prefix}s* to create cropped sticker.`
          );
        }
        break;

      case "smeme":
      case "stickermeme":
        if (/image/.test(mime)) {
          if (!text) {
            await doReact("❔");
            return m.reply(
              `Please type *${prefix}smeme <text>* to create sticker meme.`
            );
          }
          await doReact("📮");
          media = await Xbot.downloadAndSaveMediaMessage(quoted);
          mem = await TelegraPh(media);
          meme = `https://api.memegen.link/images/custom/-/${text}.png?background=${mem}`;

          let stickerMess = new Sticker(meme, {
            pack: packname,
            author: pushName,
            type: StickerTypes.FULL,
            categories: ["🤩", "🎉"],
            id: "12345",
            quality: 70,
            background: "transparent",
          });

          const stickerBuffer2 = await stickerMess.toBuffer();
          await Xbot.sendMessage(
            m.from,
            { sticker: stickerBuffer2 },
            { quoted: m }
          );
          fs.unlinkSync(media);
        } else {
          await doReact("❌");
          m.reply(
            `Please mention an *image* and type *${prefix}smeme* to create sticker meme.`
          );
        }
        break;

      case "q":
      case "quote":
        if (!text && !m.quoted) {
          await doReact("❔");
          return m.reply(
            `Please provide a text (Type or mention a message) !\n\nExample: ${prefix}q Xbot MD is OP`
          );
        }

        if (m.quoted) {
          try {
            userPfp = await Xbot.profilePictureUrl(m.quoted.sender, "image");
          } catch (e) {
            userPfp = botImage3;
          }
        } else {
          try {
            userPfp = await Xbot.profilePictureUrl(m.sender, "image");
          } catch (e) {
            userPfp = botImage3;
          }
        }
        await doReact("📮");
        var waUserName = pushName;

        const quoteText = m.quoted ? m.quoted.msg : args ? args.join(" ") : "";

        var quoteJson = {
          type: "quote",
          format: "png",
          backgroundColor: "#FFFFFF",
          width: 700,
          height: 580,
          scale: 2,
          messages: [
            {
              entities: [],
              avatar: true,
              from: {
                id: 1,
                name: waUserName,
                photo: {
                  url: userPfp,
                },
              },
              text: quoteText,
              replyMessage: {},
            },
          ],
        };

        const quoteResponse = await axios.post(
          "https://bot.lyo.su/quote/generate",
          quoteJson,
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        fs.writeFileSync(
          "quote.png",
          quoteResponse.data.result.image,
          "base64"
        );

        let stickerMess = new Sticker("quote.png", {
          pack: packname,
          author: pushName,
          type: StickerTypes.FULL,
          categories: ["🤩", "🎉"],
          id: "12345",
          quality: 70,
          background: "transparent",
        });

        const stickerBuffer2 = await stickerMess.toBuffer();
        await Xbot.sendMessage(
          m.from,
          { sticker: stickerBuffer2 },
          { quoted: m }
        )
          .then((result) => {
            fs.unlinkSync("quote.png");
          })
          .catch((err) => {
            m.reply("An error occurd!");
          });

        break;

      case "emojimix":
        if (!args[0]) {
          await doReact("❔");
          return m.reply(
            `Please provide two emojis to combine! *Example :* ${
              prefix + "emojimix"
            } 🦉+🤣`
          );
        }
        await doReact("🔖");
        let [emoji1, emoji2] = args[0].split("+");
        let jsonData = await fetch(
          `https://tenor.googleapis.com/v2/featured?key=AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ&contentfilter=high&media_filter=png_transparent&component=proactive&collection=emoji_kitchen_v5&q=${encodeURIComponent(
            emoji1
          )}_${encodeURIComponent(emoji2)}`
        ).then((res) => res.json());

        let imgUrl = jsonData.results[0].url;
        //console.log(imgUrl);

        let stcBuff = await getBuffer(imgUrl);
        fs.writeFileSync("emoji.png", stcBuff);

        let stickerMess2 = new Sticker("emoji.png", {
          pack: packname,
          author: pushName,
          type: StickerTypes.FULL,
          categories: ["🤩", "🎉"],
          id: "12345",
          quality: 70,
          background: "transparent",
        });

        const stickerBuffer = await stickerMess2.toBuffer();
        await Xbot.sendMessage(
          m.from,
          { sticker: stickerBuffer },
          { quoted: m }
        );
        await fs.unlinkSync("emoji.png");

        break;
      default:
        break;
    }
  },
};
