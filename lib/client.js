const {
  writeExifImg,
  writeExifVid,
  imageToWebp,
  videoToWebp,
} = require("./functions.js");



class Client {
  constructor(x) {
    for (let v in x) {
      this[v] = x[v]
    }
  }
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  async relayWAMessage(pesanfull) {
        if (pesanfull.message.audioMessage) {
            await this.sendPresenceUpdate('recording', pesanfull.key.remoteJid)
        } else {
            await this.sendPresenceUpdate('composing', pesanfull.key.remoteJid)
        }
        var mekirim = await this.relayMessage(pesanfull.key.remoteJid, pesanfull.message, { messageId: pesanfull.key.id })
        this.ev.emit('messages.upsert', { messages: [pesanfull], type: 'append' });
        return mekirim
    }
  
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  
  async sendImageAsSticker(jid, buff, options = {}) {
      let buffer;
      if (options && (options.packname || options.author)) {
        buffer = await writeExifImg(buff, options);
      } else {
        buffer = await imageToWebp(buff);
      }
      await this.sendMessage(
        jid,
        { sticker: { url: buffer }, ...options },
        options
      );
    };

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    async sendVideoAsSticker(jid, buff, options = {}) {
      let buffer;
      if (options && (options.packname || options.author)) {
        buffer = await writeExifVid(buff, options);
      } else {
        buffer = await videoToWebp(buff);
      }
      await this.sendMessage(
        jid,
        { sticker: { url: buffer }, ...options },
        options
      );
    };

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


}
exports.Client = Client 
