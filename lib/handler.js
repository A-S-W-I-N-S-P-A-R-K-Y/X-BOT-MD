const { SUDO, HANDLERS, WORK_TYPE } = require('../config.js');
const { serialize } = require('./serialize.js');
const { commands } = require('./plugins.js');
  module.exports = MsgHandler = async ( client , message) => {
  if (message.type !== "notify") return;
            let m = serialize(JSON.parse(JSON.stringify(message.messages[0])), client)
            let text = m.body
        commands.map(async (Sparky) => {
              
if (Sparky.fromMe && !( SUDO.split(",").includes(m.sender.split("@")[0]) || m.isSelf )) {
return;
     }
                let comman = m.text
                ? m.body[0].toLowerCase() + m.body.slice(1).trim(): "";

                let args;

                switch (true) {
                    
                    case Sparky.name && Sparky.name.test(comman):
                    args = m.body.replace(Sparky.name, '$1').trim();
                        Sparky.function({
                            m, args, client 
                        });
                        break;

                    case m.body && Sparky.on === "text":
                        args = m.body
                        Sparky.function({
                            m, args, client
                        });
                        break;
                    case Sparky.on === "image" || Sparky.on === "photo":
                        if (m.type === "imageMessage") {
                            Sparky.function({
                                m, client 
                            });

                        }
                        break;

                    case Sparky.on === "sticker":
                        if (m.type === "stickerMessage") {
                            Sparky.function({
                                m, client
                            });
                        }
                        break;
                    case Sparky.on === "video":
                        if (m.type === "videoMessage") {
                            Sparky.function({
                                m, client 
                            });
                        }
                        break;

                    default:
                        break;
                }

            })
}
