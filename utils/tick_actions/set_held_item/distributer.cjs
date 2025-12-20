const {Socket} = require('../../../data_structures.cjs')

/** 
 * @param {Socket} socket 
 */
function SetHeldItem(socket) {
    if (socket.thisPlayer.upvn >= 8 && socket.thisPlayer.upvn <= 15) return require('./213.cjs').SetHeldItem
    if (socket.thisPlayer.upvn >= 16 && socket.thisPlayer.upvn <= 26) return require('./241.cjs').SetHeldItem
    else {
        socket.log(`ERR: Cannot Run Set Held Item for Version ${socket.thisPlayer.upvn}:${socket.thisPlayer.uvni}`)
        return () => {}
    }
}

module.exports = {SetHeldItem}