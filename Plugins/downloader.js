const axios = require("axios");
const fetch = require("node-fetch")
const X = require('../config');
let mergedCommands = [
  "song",
        "insta",
        "yt360",
        "yt720",
        "gdrive",
        "apk",
        "mediafire",
        "xdl",
        "spotify",
];

module.exports = {
  name: "downloader",
  alias: [...mergedCommands],
  uniquecommands: ["song","insta","gdrive","apk","mediafire","yt360","yt720","xdl","spotify"],
  description: "All file dowloader commands",
  start: async (Xbot, m, { inputCMD, text, doReact, prefix, pushName }) => {
    switch (inputCMD) {
//song------------------------------------------------------------------------------------------------
        case "song" :
           if (!text)return m.reply(`*_Need text_*`)
       await doReact("🔅") 
        const res = await axios.get(`https://api-viper.onrender.com/api/song?name=${text}`)
        let response = await res.data
        const aud = await (await fetch(`${response.data.downloadUrl}`)).buffer()
        m.reply(`_*Downloading ${response.data.title}*_`)

      Xbot.sendMessage(m.from , {audio : aud , mimetype : 'audio/mpeg'} , { quoted : m })
        await doReact("🎶")
        break
// INSTA----------------------------------------------------------------------------------------------
        case 'insta': case  'instagram' : 
        if (!text)return m.reply(`*_Need instagram post url!_*`)
        await doReact("🔪") 
        var ig = await fetch(`https://vihangayt.me/download/instagram?url=${text}`);
        var igdl = await ig.json();
        //let type = igdl.data.data[0].type === "video" ? "image" 
        if (igdl.data.data[0].type == "video"){
        Xbot.sendMessage(m.from, { video : { url: igdl.data.data[0].url }, caption:X.CAPTION}, {quoted: m })
        }
              if (igdl.data.data[0].type == "image"){
        Xbot.sendMessage(m.from, { image : { url: igdl.data.data[0].url }, caption:X.CAPTION}, {quoted: m })
              }

              break
//gdrive---------------------------------------------------------------------------------------------------------------
        case 'gdrive'  :
      case 'drive' :
        if (!text)return m.reply(`*_Need  url!_*`)
        await doReact("🔪");
        var document= await fetch(`https://vihangayt.me/download/gdrive?url=${text}`);
        var zip = await document.json();

        Xbot.sendMessage(m.from, { document :{ url: zip.data.downloadUrl }, fileName: `${zip.data.fileName}` , mimetype: "application/x-zip-compressed" }, {quoted: m })
                   break 
//mediafire-----------------------------------------------------------------------------------------------------------------
        case 'mediafire'  :
        if (!text)return m.reply(`*_Need  url!_*`)
        await doReact("🔪");
        var document= await fetch(`https://vihangayt.me/download/mediafire?url=${text}`);
        var zip = await document.json();

        Xbot.sendMessage(m.from, { document :{ url: zip.data.link }, fileName: `${zip.data.name}` , mimetype: "application/zip" }, {quoted: m })
                   break 
//apk-------------------------------------------------------------------------------------------------------------
        case 'apk' : 
        if (!text)return m.reply(`*_Need  text!_*`)
        await doReact("🔪");
        var document= await fetch(`https://vihangayt.me/download/apk?id=${text}`);
        var zip = await document.json();

        Xbot.sendMessage(m.from, { document :{ url: zip.data.dllink }, fileName: `${zip.data.name}` , mimetype: "application/vnd.android.package-archive" }, {quoted: m })

              break
//yt---------------------------------------------------------------------------------------------------
        case 'yt360' : 
        if (!text)return m.reply(`*_Need video post url!_*`)
        await doReact("🔪");
        var ytmp4 = await fetch(`https://vihangayt.me/download/ytmp4?url=${text}`);
        var yt = await ytmp4.json();

        Xbot.sendMessage(m.from, { video :{ url: yt.data.vid_360p }, caption: `*${yt.data.title}*`}, {quoted: m })
                    break
//SPOTIFY----------------------------------------------------------------------------------------------------------------
                    case 'spotify' : 
        if (!text)return m.reply(`*_Need url_*`)
        await doReact("🎼");
        var sex = await fetch(`https://vihangayt.me/download/spotify?url=${text}`);
        var fek = await sex.json();
        m.reply(`Downloading ${fek.data.title}...`)
        Xbot.sendMessage(m.from, { audio :{ url: fek.data.url } , mimetype : 'audio/mpeg' },  {quoted: m })
                    break


//YT720----------------------------------------------------------------------------------------------------------------------
            case 'yt720' : 
                    if (!text) return m.reply('_*Need video url*_')
                    var ytmp4 = await
                    fetch(`https://vihangayt.me/download/ytmp4?url=${text}`)
        var yt = await ytmp4.json()
                    Xbot.sendMessage(m.from,{video:{ url: yt.data.vid_720p}, caption : `_*${yt.data.title}*_`}, {quoted : m})
                    break
                    case 'yta' :
                    if (!text) return Xbot.sendMessage(m.from, { text : '_*Need yt url*_'} )
                    var ytmp3 = await fetch(`https://api.xfarr.com/api/download/ytaudio?apikey=rty68kAvnd&url=${text}`)
        var yt = await ytmp3.json()
                    Xbot.sendMessage(m.from,{ audio :{ url: yt.result.download[0].url }, caption : `_*${yt.result.title}*_`,  mimetype: 'audio/mpeg' , ptt: false } , {quoted : m})
                    break
//XVIDEOS DL-----------------------------------------------------------------------------------------------------------------
        case 'xdl' : 
        if (!text)return m.reply(`*_Need query_*`)
        await doReact("💦");
        var sex = await fetch(`https://raganork-network.vercel.app/api/xvideos/download?url=${text}`);
        var fek = await sex.json();

        Xbot.sendMessage(m.from, { video :{ url: fek.url }, caption: X.CAPTION}, {quoted: m })
                    break
//-------------------------------------------------------------------------------------------------------------
    }}}
