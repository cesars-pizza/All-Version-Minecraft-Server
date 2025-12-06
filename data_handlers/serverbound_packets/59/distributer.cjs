const {Socket} = require('../../../data_structures.cjs')

/** 
 * @param {Socket} socket 
 */
function ReadPacket(socket) {
    if (socket.thisPlayer.upvn >= 11 && socket.thisPlayer.upvn <= 15) return require('./222.cjs').ReadPacket
    else {
        socket.log(`ERR: Cannot Parse Packet 59 for Version ${socket.thisPlayer.upvn}:${socket.thisPlayer.uvni}`)
        return () => {}
    }
}

module.exports = {ReadPacket}