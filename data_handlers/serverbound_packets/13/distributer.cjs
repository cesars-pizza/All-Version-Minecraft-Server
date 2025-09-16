const {Socket} = require('../../../data_structures.cjs')

/** 
 * @param {Socket} socket 
 */
function ReadPacket(socket) {
    if (socket.thisPlayer.upvn >= 0 && socket.thisPlayer.upvn <= 4) return require('./42.cjs').ReadPacket
    else {
        socket.log(`ERR: Cannot Parse Packet 13 for Version ${socket.thisPlayer.upvn}:${socket.thisPlayer.uvni}`)
        return () => {}
    }
}

module.exports = {ReadPacket}