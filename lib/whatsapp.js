const {
  extensionForMediaMessage,
  extractMessageContent,
  jidNormalizedUser,
  getContentType,
  normalizeMessageContent,
  proto,
  delay,
  downloadContentFromMessage,
  getBinaryNodeChild,
} = require("@whiskeysockets/baileys");
const fs = require("fs");
const FileType = require("file-type");
const { getRandom, fetchBuffer } = require("./Function");

class WAConnection {
  constructor(Xbot) {
    for (let v in Xbot) {
      this[v] = Xbot[v];
    }
  }

  /**
   *
   * @param {*} m
   */
  async serializeM(m) {
    return exports.serialize(this, m);
  }

  /**
   *
   * @param {*} text
   * @returns
   */
  parseMention(text) {
    return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(
      (v) => v[1] + "@s.whatsapp.net"
    );
  }

  /**
   *
   * @param {*} message
   * @param {*} fileName
   * @returns
   */
  async downloadMediaMessage(message, fileName) {
    message = message?.msg ? message?.msg : message;
    let mimetype = (message.msg || message).mimetype || "";
    let mtype = message.type
      ? message.type.replace(/Message/gi, "")
      : mimetype.split("/")[0];
    const stream = await downloadContentFromMessage(message, mtype);
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk]);
    }

    if (fileName) {
      let ftype = await FileType.fromBuffer(buffer);
      let trueFileName = fileName
        ? fileName + "." + ftype.ext || mimetype.split("/")[1]
        : getRandom(ftype.ext || mimetype.split("/")[1]);
      return fs.writeFileSync(trueFileName, buffer);
    } else {
      return buffer;
    }
  }

  /**
   *
   * @param {*} message
   * @param {*} fileName
   * @param {*} attachExtension
   * @returns
   */
  async downloadAndSaveMediaMessage(message, filename, attachExtension = true) {
    let quoted = message.msg ? message.msg : message;
    let mime = (message.msg || message).mimetype || "";
    let messageType = message.mtype
      ? message.mtype.replace(/Message/gi, "")
      : mime.split("/")[0];
    const stream = await downloadContentFromMessage(quoted, messageType);
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk]);
    }
    let type = await FileType.fromBuffer(buffer);
    let trueFileName = attachExtension ? filename + "." + type.ext : filename;
    // save to file
    await fs.writeFileSync(trueFileName, buffer);
    return trueFileName;
  }
}
exports.WAConnection = WAConnection;

exports.serialize = (Xbot, m, options = {}) => {
  if (!m) return m;
  let M = proto.WebMessageInfo;
  m = M.fromObject(m);
  if (m.key) {
    m.from = jidNormalizedUser(m.key.remoteJid || m.key.participant);
    m.fromMe = m.key.fromMe;
    m.id = m.key.id;
    m.isBot = m.id.startsWith("BAE5") && m.id.length == 16;
    m.isGroup = m.from.endsWith("@g.us");
    m.sender = jidNormalizedUser(
      (m.fromMe && Xbot.user?.id) || m.key.participant || m.from || ""
    );
  }
  if (m.message) {
    m.type = getContentType(m.message);
    m.message = extractMessageContent(m.message);
    m.msg = m.message[m.type];
    m.mentions = m.msg?.contextInfo ? m.msg?.contextInfo.mentionedJid : [];
    m.quoted = m.msg?.contextInfo ? m.msg?.contextInfo.quotedMessage : null;
    if (m.quoted) {
      m.quoted.type = getContentType(m.quoted);
      m.quoted.msg = m.quoted[m.quoted.type];
      m.quoted.mentions = m.msg.contextInfo.mentionedJid;
      m.quoted.id = m.msg.contextInfo.stanzaId;
      m.quoted.sender = jidNormalizedUser(
        m.msg.contextInfo.participant || m.sender
      );
      m.quoted.from = m.from;
      m.quoted.isGroup = m.quoted.from.endsWith("@g.us");
      m.quoted.isBot = m.quoted.id.startsWith("BAE5") && m.quoted.id == 16;
      m.quoted.fromMe =
        m.quoted.sender == jidNormalizedUser(Xbot.user && Xbot.user?.id);
      m.quoted.text =
        m.quoted.msg?.text ||
        m.quoted.msg?.caption ||
        m.quoted.msg?.conversation ||
        m.quoted.msg?.contentText ||
        m.quoted.msg?.selectedDisplayText ||
        m.quoted.msg?.title ||
        "";
      let vM = (m.quoted.fakeObj = M.fromObject({
        key: {
          remoteJid: m.quoted.from,
          fromMe: m.quoted.fromMe,
          id: m.quoted.id,
        },
        message: m.quoted,
        ...(m.quoted.isGroup ? { participant: m.quoted.sender } : {}),
      }));
      m.quoted.delete = () =>
        Xbot.sendMessage(m.quoted.from, { delete: vM.key });
      m.quoted.download = (pathFile) =>
        Xbot.downloadMediaMessage(m.quoted.msg, pathFile);
    }
  }
  m.download = (pathFile) => Xbot.downloadMediaMessage(m.msg, pathFile);
  m.body = m.text =
    m.message?.conversation ||
    m.message?.[m.type]?.text ||
    m.message?.[m.type]?.caption ||
    m.message?.[m.type]?.contentText ||
    m.message?.[m.type]?.selectedDisplayText ||
    m.message?.[m.type]?.title ||
    "";
  m.reply = (text, chatId = m.from, options = {}) =>
    Buffer.isBuffer(text)
      ? Xbot.sendFile(chatId, text, "file", "", m, { ...options })
      : Xbot.sendText(chatId, text, m, { ...options });

  return m;
};
