// myre ith nokkeet venel vere plugs indakikko

module.exports = {
    order: ['jid','id'],
    exec: async (msg, client, from) => {
        await msg.reply(from)
     }
}
