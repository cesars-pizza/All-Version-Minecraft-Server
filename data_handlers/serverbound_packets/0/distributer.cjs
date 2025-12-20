const {Socket} = require('../../../data_structures.cjs')

/** 
 * @param {Socket} socket 
 */
function ReadPacket(socket) {
    if (socket.thisPlayer.upvn == -1) return require('./29.cjs').ReadPacket
    else if (socket.thisPlayer.upvn >= 0 && socket.thisPlayer.upvn <= 2) return require('./42.cjs').ReadPacket
    else if (socket.thisPlayer.upvn >= 3 && socket.thisPlayer.upvn <= 4) return require('./55.cjs').ReadPacket
    else if (socket.thisPlayer.upvn >= 8 && socket.thisPlayer.upvn <= 15) return require('./213.cjs').ReadPacket
    else if (socket.thisPlayer.upvn >= 16 && socket.thisPlayer.upvn <= 26) return require('./241.cjs').ReadPacket
    else {
        socket.log(`ERR: Cannot Parse Packet 0 for Version ${socket.thisPlayer.upvn}:${socket.thisPlayer.uvni}`)
        return () => {}
    }
}

module.exports = {ReadPacket}