const gis = require("g-i-s");
const axios = require("axios");
let mergedCommands = [
  "couplepp",
];

module.exports = {
  name: "pictures",
  alias: [...mergedCommands],
  uniquecommands:[
    "couplepp",
  ],
  description: "All picture related commands",
  start: async (Xbot, m, { inputCMD, text, doReact, prefix}) => {
    switch (inputCMD) {
      case "couplepp":
       await doReact("❤️");
        let imgRes = await axios.get("https://zany-teal-alligator-suit.cyclic.app/couple");
        Xbot.sendMessage(
          m.from,
          { image: { url: imgRes.data.male }, caption: `_For Him..._` },
          { quoted: m }
        );
        Xbot.sendMessage(
          m.from,
          { image: { url: imgRes.data.female }, caption: `_For Her..._` },
          { quoted: m }
        );
        break;

      default:
        break;
    }
  },
};
