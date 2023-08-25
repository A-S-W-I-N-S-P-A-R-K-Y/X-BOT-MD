"use strict";
const fs = require('fs')
const chalk = require('chalk')

module.exports = [{
 chats: [ '@s.whatsapp.net', '@g.us' ],
 rules: `
${["1"] + ["."] + ["[❗]"] + [" Jangan spam bot "]}
${["2"] + ["."] + ["[❗]"] + [" Bot di lengkapi anti Call/telfon"] + ["\n"] + [" "] + ["Telfon = Blokir! "]}
${["3"] + ["."] + ["[❗]"] + [" Bot tidak selalu online,"] + ["\n"] + [" "] + ["tergantung ownernya "]}
${["4"] + ["."] + ["[❗]"] + [" Jangan lupa donasi kak, "] + ["\n"] + [" "] + ["Bot online juga butuh kuota "]}
${["5"] + ["."] + ["[❗]"] + [" Jika menemukan bug silahkan lapor"] + ["\n"] + [" "] + ["dengan cara ketik "] + ["[ "] + ["*"] + ["#"] + ["bug "] + ["_keluhan_"] + ["*"] + [" ]"]}
${["6"] + ["."] + ["[❗]"] + [" Kami sangat melarang spam!"]}
`,
 message: [ 
         '[ *[❗]CHAT DITERUSKAN[❗]* ]',
         'Khusus Group!',
         'Khusus Owner!',
         'Khusus Admin!',
         'Bot bukan Admin!',
         '「▰▰▰▰▰▰▰▰▰▰」Success✓!',
         '```「▰▰▱▱▱▱▱▱▱▱」Loading...```',
         '```「▰▰▰▰▰▰▰▰▱▱」Sending...```',
         "Masukan nomer target",
       ],
 mode: [
      '[ PUBLIC - MODE ]',
      '[ SELF - MODE ]'
    ],
cmd: [ 
      '\x1b[1;34m~\x1b[1;37m>', 
      '[\x1b[1;33mCMD\x1b[1;37m]'
   ],    
}]

let file = require.resolve(__filename)
fs.watchFile(file, () => {
	fs.unwatchFile(file)
	console.log(chalk.yellow(`New ${__filename}`))
	delete require.cache[file]
	require(file)
})
