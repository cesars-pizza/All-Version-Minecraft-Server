const {Socket} = require('../../../data_structures.cjs')

/** 
 * @param {Socket} socket 
 */
function ReadPacket(socket) {
    if (socket.thisPlayer.upvn >= -1 && socket.thisPlayer.upvn <= 0) return require('./29.cjs').ReadPacket
    if (socket.thisPlayer.upvn >= 1 && socket.thisPlayer.upvn <= 4) return require('./43.cjs').ReadPacket
    else {
        socket.log(`ERR: Cannot Parse Packet 8 for Version ${socket.thisPlayer.upvn}:${socket.thisPlayer.uvni}`)
        return () => {}
    }
}

module.exports = {ReadPacket}