const { Client } = require('./lib/start.js')
const { DATABASE, VERSION } = require('./settings)
const { stopInstance } = require('./lib/pm2')
const _0x13468=_0x18c4;function _0x5f38(){const _0x3c4877=['25691512AwwAjQ','729845RRANyW','12635434ofifwD','3675300HWqlif','810044pBcXwm','72jthWPE','845746JmgDkD','../sparky.js','5522824FKcCiM'];_0x5f38=function(){return _0x3c4877;};return _0x5f38();}(function(_0x2c0436,_0x5ad27b){const _0x445646=_0x18c4,_0x555460=_0x2c0436();while(!![]){try{const _0x61c2f9=parseInt(_0x445646(0x1b4))/0x1+-parseInt(_0x445646(0x1b2))/0x2+-parseInt(_0x445646(0x1b1))/0x3+-parseInt(_0x445646(0x1b6))/0x4+parseInt(_0x445646(0x1af))/0x5*(parseInt(_0x445646(0x1b3))/0x6)+-parseInt(_0x445646(0x1b0))/0x7+parseInt(_0x445646(0x1ae))/0x8;if(_0x61c2f9===_0x5ad27b)break;else _0x555460['push'](_0x555460['shift']());}catch(_0x937c22){_0x555460['push'](_0x555460['shift']());}}}(_0x5f38,0xf269b));function _0x18c4(_0x5340b4,_0x2641ca){const _0x5f380f=_0x5f38();return _0x18c4=function(_0x18c4dd,_0x181e80){_0x18c4dd=_0x18c4dd-0x1ae;let _0xa2c8ea=_0x5f380f[_0x18c4dd];return _0xa2c8ea;},_0x18c4(_0x5340b4,_0x2641ca);}const {aswin,sparky}=require(_0x13468(0x1b5));

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
