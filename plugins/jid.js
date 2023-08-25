

module.exports = {
    order: ['jid','id'],
    exec: async (msg, client, from) => {
      	
    
            if (msg.quoted) { adreply(msg.quoted.sender)} else {
    adreply(from)}
     }
}