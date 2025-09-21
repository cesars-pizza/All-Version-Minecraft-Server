const {Socket} = require('../../../data_structures.cjs')

/** 
 * @param {Socket} socket 
 */
function WritePacket(socket) {
    if (socket.thisPlayer.upvn == -1) return require('./29.cjs').WritePacket
    else if (socket.thisPlayer.upvn >= 0 && socket.thisPlayer.upvn <= 2) return require('./42.cjs').WritePacket
    else if (socket.thisPlayer.upvn >= 3 && socket.thisPlayer.upvn <= 4) return require('./55.cjs').WritePacket
    else {
        socket.log(`ERR: Cannot Write Server Identification Packet for Version ${socket.thisPlayer.upvn}:${socket.thisPlayer.uvni}`)
        return () => {}
    }
}

module.exports = {WritePacket}