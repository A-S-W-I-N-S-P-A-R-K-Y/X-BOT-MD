const { getRandom } = require("../lib/Function");
const { webp2mp4File } = require("../lib/Uploader");
const { toAudio } = require("../lib/File-Converter");
const { exec } = require("child_process");
const fs = require("fs");
const PDFDocument = require("pdfkit");
let { GraphOrg } = require("../lib/Uploader");
const googleTTS = require('google-tts-api');
const { getBuffer } = require("../lib/Function2.js");
const X = require('../config');
const util = require("util");
let mergedCommands = [
  "photo",
  "toimage",
  "gif",
  "mp4",
  "tomp3",
  "mp3",
  "url",
  "pdf",
  "imgtopdf",
  "toqr",
  "remini",
  "wave",
  "tts"
];

module.exports = {
  name: "converters",
  alias: [...mergedCommands],
  uniquecommands: [
    "photo",
    "gif",
    "mp4",
    "tomp3",
    "mp3",
    "url",
    "pdf",
    "imgtopdf",
    "toqr",
    "remini",
    "wave",
    "tts"
  ],
  description: "All converter related commands",
  start: async (
    Xbot,
    m,
    { inputCMD, text, quoted, doReact, prefix, mime }
  ) => {
    switch (inputCMD) {
        
      case "tts":
        if (!text) {
            m.reply('*ᴇɴᴛᴇʀ ᴛᴇxᴛ*')
        } else {
            let [txt,lang] = text.split`:`
            const audio = googleTTS.getAudioUrl(`${txt}`, {
                lang: lang || "en-US",
                slow: false,
                host: "https://translate.google.com",
            })
            Xbot.sendMessage(m.from, {
                audio: {
                    url: audio,
                },
                mimetype: 'audio/mpeg',
                ptt: true,
            }, {
                quoted: m,
            })

        }
    break
      case "photo":
      case "toimage":
        if (!m.quoted && !/webp/.test(mime)) {
          await doReact("❔");
          return m.reply(
            `Please reply to a *Non-animated* sticker to convert it to image`
          );
        }
        await doReact("📸");
        let mediaMess = await Xbot.downloadAndSaveMediaMessage(quoted);
        let ran = await getRandom(".png");
        exec(`ffmpeg -i ${mediaMess} ${ran}`, (err) => {
          fs.unlinkSync(mediaMess);
          if (err) {
            Xbot.sendMessage(
              m.from,
              {
                text: `Please mention a *Non-animated* sticker to process ! \n\nOr use *${prefix}gif* / *${prefix}mp4*  to process *Animated* sticker !`,
              },
              { quoted: m }
            );
            return;
          }
          let buffer = fs.readFileSync(ran);
          Xbot.sendMessage(
            m.from,
            { image: buffer, caption: `_Converted by:_  *${botName}*\n` },
            { quoted: m }
          );
          fs.unlinkSync(ran);
        });
        break;

      case "mp4":
        if (!m.quoted && !/webp/.test(mime)) {
          await doReact("❔");
          return reply(
            `Please reply to an *Animated* sticker to convert it to video !`
          );
        }
        await doReact("🎞️");
        let mediaMess2 = await Xbot.downloadAndSaveMediaMessage(quoted);
        let webpToMp4 = await webp2mp4File(mediaMess2);

        await Xbot.sendMessage(
          m.from,
          {
            video: { url: webpToMp4.result },
            caption: `_Converted by:_  *${botName}*\n`,
          },
          { quoted: m }
        );
        fs.unlinkSync(mediaMess2);
        break;

      case "gif":
        if (!m.quoted && !/webp/.test(mime)) {
          await doReact("❔");
          return m.reply(
            `Please reply to an *Animated* sticker to convert it to gif !`
          );
        }
        await doReact("👾");
        let mediaMess3 = await Xbot.downloadAndSaveMediaMessage(quoted);
        let webpToMp42 = await webp2mp4File(mediaMess3);

        await Xbot.sendMessage(
          m.from,
          {
            video: { url: webpToMp42.result },
            caption: `_Converted by:_  *${botName}*\n`,
            gifPlayback: true,
          },
          { quoted: m }
        );
        fs.unlinkSync(mediaMess3);

        break;

      case "tomp3":
      
        if (/document/.test(mime)) {
          await doReact("❌");
          return m.reply(
            `Send/Reply Video/Audio You Want To Convert Into MP3 With Caption *${prefix}tomp3*`
          );
        }
        if (!/video/.test(mime) && !/audio/.test(mime)) {
          await doReact("❌");
          return reply(
            `Send/Reply Video/Audio You Want To Convert Into MP3 With Caption *${prefix}tomp3*`
          );
        }
        if (!m.quoted) {
          await doReact("❔");
          return m.reply(
            `Send/Reply Video/Audio You Want To Convert Into MP3 With Caption ${prefix}tomp3`
          );
        }
        await doReact("🎶");
        let media = await quoted.download();
        await Xbot.sendPresenceUpdate("recording", m.from);
        let audio = await toAudio(media, "mp4");
        Xbot.sendMessage(
          m.from,
          {
            audio: audio,
            mimetype: "audio/mpeg",
            fileName: `Converted By ${botName} ${m.id}.mp3`,
          },
          { quoted: m }
        );

        break;

      case "mp3":
        if (/document/.test(mime)) {
          await doReact("❌");
          return m.reply(
            `Send/Reply Video/Audio You Want To Convert Into MP3 With Caption *${prefix}tomp3*`
          );
        }
        if (!/video/.test(mime) && !/audio/.test(mime)) {
          await doReact("❌");
          return m.reply(
            `Send/Reply Video/Audio You Want To Convert Into MP3 With Caption *${prefix}tomp3*`
          );
        }
        if (!m.quoted) {
          await doReact("❔");
          return m.reply(
            `Send/Reply Video/Audio You Want To Convert Into MP3 With Caption ${prefix}tomp3`
          );
        }
        await doReact("🎶");
        let media2 = await quoted.download();
        await Xbot.sendPresenceUpdate("recording", m.from);
        let audio2 = await toAudio(media2, "mp4");
        Xbot.sendMessage(
          m.from,
          { audio: audio2, mimetype: "audio/mpeg" },
          { quoted: m }
        );
        break;

      case "url":
        if (!m.quoted) {
          await doReact("❔");
          return m.reply(
            `Plese provide an *Image* / *Video* to generate a link! With Caption ${prefix}url`
          );
        }
        let media5 = await Xbot.downloadAndSaveMediaMessage(quoted);
        if (/image/.test(mime)) {
          await doReact("🔗");
          let anu = await GraphOrg(media5);
          m.reply(`*Generated Image URL:* \n\n${util.format(anu)}\n`);
        } else if (/video/.test(mime)) {
          await doReact("▶️");
          try {
            let anu = await GraphOrg(media5);
            m.reply(`*Generated Video URL:* \n\n${util.format(anu)}\n`);
          } catch (e) {
            await doReact("❌");
            await fs.unlinkSync(media5);
            return Xbot.sendMessage(
              m.from,
              {
                text: `*Your video size is too big!*\n\n*Max video size:* 5MB`,
              },
              { quoted: m }
            );
          }
        } else {
          await doReact("❌");
          return m.reply(
            `Plese provide an *Image* / *Video* to generate a link!`
          );
        }
        await fs.unlinkSync(media5);
        break;

      case "pdf":
      case "imgtopdf":
        if (/image/.test(mime)) {
          await doReact("📑");
          let mediaMess4 = await Xbot.downloadAndSaveMediaMessage(quoted);

          async function generatePDF(path) {
            return new Promise((resolve, reject) => {
              const doc = new PDFDocument();

              const imageFilePath = mediaMess4.replace(/\\/g, "/");
              doc.image(imageFilePath, 0, 0, {
                width: 612, // It will make your image to horizontally fill the page - Change it as per your requirement
                align: "center",
                valign: "center",
              });

              doc.pipe(fs.createWriteStream(path));

              doc.on("end", () => {
                resolve(path);
              });

              doc.end();
            });
          }

          try {
            let randomFileName = `./${Math.floor(
              Math.random() * 1000000000
            )}.pdf`;
            const pdfPATH = randomFileName;
            await generatePDF(pdfPATH);
            pdf = fs.readFileSync(pdfPATH);

            setTimeout(async () => {
              let pdf = fs.readFileSync(pdfPATH);

              Xbot.sendMessage(
                m.from,
                {
                  document: pdf,
                  fileName: `Converted By ${botName}.pdf`,
                },
                { quoted: m }
              );

              fs.unlinkSync(mediaMess4);
              fs.unlinkSync(pdfPATH);
            }, 1000);
          } catch (error) {
            await doReact("❌");
            console.error(error);
            return m.reply(
              `An error occurred while converting the image to PDF.`
            );
          }
        } else {
          await doReact("❔");
          return m.reply(`Please reply to an *Image* to convert it to PDF!`);
        }
        break;
      case "toqr":
        if (!text) {
          await doReact("❔");
          return m.reply(
            `Please provide an URL to convert into QR code!\n\nExample: *${prefix}toqr https://github.com/A-S-W-I-N-S-P-A-R-K-Y/*`
          );
        }

        const res = await getBuffer(
          `https://www.qrtag.net/api/qr_8.png?url=${text}`
        );
        await Xbot.sendMessage(
          m.from,
          { image: res, caption: `\n*Source:* ${text}` },
          { quoted: m }
        );
        break;
//-----------------------------------------------------------------------------
        case "remini":
        await doReact("❔");
        if (!/image/.test(mime)) return m.reply(`Please reply to a *image*`);
            await doReact("🫠");
            const { remini } = require('../lib/remini.js')
        let media9 = await m.quoted.download()
        let proses = await remini(media9, "enhance")
        await Xbot.sendMessage(m.from, { image: proses, caption:X.CAPTION}, { quoted: m})
        break
//----------------------------------------------------------------------------------------
        case 'wave':
        case 'tovn': {
              if (!/video/.test(mime) && !/audio/.test(mime)) return m.reply(`Reply Video/Audio that you want to make into a wave`)
           //await doReact("❔");
          //  let media = await Xbot.downloadMediaMessage(m.quoted.message)
          let media = await m.quoted.download();
            let {
                toPTT
            } = require('../lib/File-Converter')
            let audio = await toPTT(media, 'mp4')
            Xbot.sendMessage(m.from, {
                audio: audio,
                mimetype: 'audio/mpeg',
                ptt: true
            }, {
                quoted: m
            })

        }
        break
      default:
        break;
    }
  },
};
