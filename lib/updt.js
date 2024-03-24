const axios = require('axios')
const fs = require('fs-extra')

async function updatedb() {	
	const simpleGit = require('simple-git')	
			const git = simpleGit();	
		const Heroku = require('heroku-client');	
		const heroku = new Heroku({ token: process.env.HEROKU_API_KEY })	
			await git.fetch();	
					var commits = await git.log(['main' + '..origin/' +'main']);	
					if (commits.total === 0) {	
						return 'ʏᴏᴜ..ʜᴀᴠᴇ...ᴀʟʀᴇᴅʏ..ᴜᴘᴅᴀᴛᴇᴅ...'	
					} else {	
								var app = await heroku.get('/apps/' + process.env.HEROKU_APP_NAME)	
							 //   await Void.sendMessage(citel.chat,{text:'*ᴜᴘᴅᴀᴛɪɴɢ...*'})	
							git.fetch('upstream', 'main');	
							git.reset('hard', ['FETCH_HEAD']);	
	
							var git_url = app.git_url.replace(	
								"https://", "https://api:" + process.env.HEROKU_API_KEY + "@"	
							)   	
							try {	
								await git.addRemote('heroku', git_url);	
							} catch { console.log('heroku remote adding error'); }	
							await git.push('heroku', 'main');	
	
							return '*ʙᴏᴛ ᴜᴘᴅᴀᴛᴇᴅ...*\n_Restarting._'	
	
	
					}	
}

module.exports = {
  updatedb
}
