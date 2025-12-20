const {Socket} = require('../../../data_structures.cjs')

/** 
 * @param {Socket} socket 
 */
function ReadPacket(socket) {
    if (socket.thisPlayer.upvn >= 8 && socket.thisPlayer.upvn <= 26) return require('./213.cjs').ReadPacket
    else {
        socket.log(`ERR: Cannot Parse Packet 255 for Version ${socket.thisPlayer.upvn}:${socket.thisPlayer.uvni}`)
        return () => {}
    }
}

module.exports = {ReadPacket}