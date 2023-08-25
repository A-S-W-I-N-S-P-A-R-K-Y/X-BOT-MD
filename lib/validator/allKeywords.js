"use strict";
const fs = require('fs')
const chalk = require('chalk')

module.exports = [{
 chats: [ '@s.whatsapp.net', '@g.us' ],
 rules: `
${["1"] + ["."] + ["[❗]"] + [" Don't spam bots "]}
${["2"] + ["."] + ["[❗]"] + [" Bots are equipped with anti Call / telephone"] + ["\n"] + [" "] + ["Call = Block! "]}
${["3"] + ["."] + ["[❗]"] + [" Bots are not always online,"] + ["\n"] + [" "] + ["depending on the owner "]}
${["4"] + ["."] + ["[❗]"] + [" Don't forget to donate biro"] + ["\n"] + [" "] + ["Online bots also need quota "]}
${["5"] + ["."] + ["[❗]"] + [" If you find a bug please report it"] + ["\n"] + [" "] + ["by typing "] + ["[ "] + ["*"] + ["#"] + ["bug "] + ["_complaint_"] + ["*"] + [" ]"]}
${["6"] + ["."] + ["[❗]"] + [" We strictly prohibit spam!"]}
`,
 message: [ 
         '[ *[❗]CHAT CONTINUED[❗]* ]',
         'Special Group!',
         'Special Owner!',
         'Special Admin!',
         'Bot is not Admin!',
         '「▰▰▰▰▰▰▰▰▰▰」Success✓!',
         '```「▰▰▱▱▱▱▱▱▱▱」Loading...```',
         '```「▰▰▰▰▰▰▰▰▱▱」Sending...```',
         "Enter the target number",
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
