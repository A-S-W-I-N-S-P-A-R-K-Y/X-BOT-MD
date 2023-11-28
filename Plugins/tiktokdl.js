let mergedCommands = [
  "tiktok",
];

module.exports = {
  name: "tiktokDl",
  alias: [...mergedCommands],
  uniquecommands: ["tiktok"],
  description: "All Tiktok Downloader Commands",
  start: async (
    Xbot,
    m,
    {
      inputCMD,
      text,
      prefix,
      doReact,
      args,
      isMedia,
      quoted,
    }
  ) => {
    if (!text) {
      await doReact("❌");
      return m.reply(
        `Please provide a Toktok video link !\n\nExample: ${prefix}say Xbot MD is OP`
      );
    }
    if (!text.includes("tiktok")) {
      await doReact("❌");
      return m.reply("Please provide a valid Tiktok link!");
    }

    switch (inputCMD) {
      
      case "tiktok":
        await doReact("📥");

        require("../lib/Tiktokscraper")
          .Tiktok(args[0])
          .then((data) => {
            Xbot.sendMessage(
              m.from,
              {
                video: { url: data.watermark },
                caption: `Downloaded by: *${botName}*`,
              },
              { quoted: m }
            );
          });

        break;
      default:
        break;
    }
  },
};
