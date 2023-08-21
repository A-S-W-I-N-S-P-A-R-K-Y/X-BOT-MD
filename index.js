const { Client } = require('./lib/start.js')
const { DATABASE, VERSION } = require('./settings)
const { stopInstance } = require('./lib/pm2')

const start = async () => {
	try {
		logger.info(`X-BOT-MD ${VERSION}`)
		try {
			await DATABASE.authenticate()
		} catch (error) {
			console.error('Database Oombie 😹🖐🏻:', error)
			stopInstance()
		}
		await DATABASE.sync()
		logger.info('Database syncing...')
		const bot = new Client()
		await bot.init()
		await bot.connect()
	} catch (error) {
		logger.error(error)
	}
}
start()
