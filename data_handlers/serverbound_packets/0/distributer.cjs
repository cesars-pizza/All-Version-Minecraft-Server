const {Socket} = require('../../../data_structures.cjs')

/** 
 * @param {Socket} socket 
 */
function ReadPacket(socket) {
    if (socket.thisPlayer.upvn == -1) return require('./29.cjs').ReadPacket
    else {
        socket.log(`ERR: Cannot Parse Packet 0 for Version ${socket.thisPlayer.upvn}:${socket.thisPlayer.uvni}`)
        return () => {}
    }
}

module.exports = {ReadPacket}