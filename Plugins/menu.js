const fs = require("fs");
const axios = require("axios");
const path = require("path");
const package = require("../package.json");
const x = require("../config.js");
const { randomFancy, tiny } = require("@viper-x/fancytext");
const { PREFIX,
BOT_INFO } = require('../config')
const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)
const pad = (s) => (s < 10 ? "0" : "") + s;
const formatTime = (seconds) => {
  const hours = Math.floor(seconds / (60 * 60));
  const minutes = Math.floor((seconds % (60 * 60)) / 60);
  const secs = Math.floor(seconds % 60);
  return (time = `${pad(hours)}:${pad(minutes)}:${pad(secs)}`);
};
const uptime = () => formatTime(process.uptime());
let mergedCommands = [
  "help",
  "h",
  "menu",
];

module.exports = {
  name: "systemcommands",
  alias: [...mergedCommands],
  start: async (
    Xbot,
    m,
    { pushName, prefix, inputCMD, doReact, text, args }
  ) => {
    const pic = "https://i.imgur.com/MsNQ8wf.jpg"
    switch (inputCMD) {

      case "help":
      case "h":
      case "menu":
        await doReact("🗿");
        await Xbot.sendPresenceUpdate("composing", m.from);
        function readUniqueCommands(dirPath) {
          const allCommands = [];

          const files = fs.readdirSync(dirPath);

          for (const file of files) {
            const filePath = path.join(dirPath, file);
            const stat = fs.statSync(filePath);

            if (stat.isDirectory()) {
              const subCommands = readUniqueCommands(filePath);
              allCommands.push(...subCommands);
            } else if (stat.isFile() && file.endsWith(".js")) {
              const command = require(filePath);

              if (Array.isArray(command.uniquecommands)) {
                const subArray = [file, ...command.uniquecommands];
                allCommands.push(subArray);
              }
            }
          }

          return allCommands;
        }

        function formatCommands(allCommands) {
          let formatted = "";

          for (const [file, ...commands] of allCommands) {
            const capitalizedFile =
              file.replace(".js", "").charAt(0).toUpperCase() +
              file.replace(".js", "").slice(1);

            formatted += `┏────▷ *${capitalizedFile}* ◁⊰\n`;
            formatted += `\`\`\`${commands
              .map((cmd) => `│▸ ${prefix + cmd}`)
              .join("\n")}\`\`\`\n┗────────────⊰\n\n`;
          }

          return formatted.trim();
        }

        const pluginsDir = path.join(process.cwd(), "Plugins");

        const allCommands = readUniqueCommands(pluginsDir);
        const formattedCommands = formatCommands(allCommands);
        var helpText = `*Bot name : ${BOT_INFO.split(";")[0]}*
*User* : *${pushName}*
*Prefix : ${prefix}*
*Owner : ${BOT_INFO.split(";")[1]}*
*Uptime :${uptime()}*
        \n${readMore}\n${formattedCommands}`;
        await Xbot.sendMessage(
          m.from,
          { video: { url: botVideo }, gifPlayback: true, caption: tiny(helpText) },
          { quoted: m }
        );

        break;
        
      default:
        break;
    }
  },
};
