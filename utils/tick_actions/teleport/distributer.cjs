const {Socket} = require('../../../data_structures.cjs')

/** 
 * @param {Socket} socket 
 */
function TeleportSelf(socket) {
    if (socket.thisPlayer.upvn >= -1 && socket.thisPlayer.upvn <= 4) return require('./29.cjs').TeleportSelf
    else {
        socket.log(`ERR: Cannot Run Teleport Self for Version ${socket.thisPlayer.upvn}:${socket.thisPlayer.uvni}`)
        return () => {}
    }
}

module.exports = {TeleportSelf}