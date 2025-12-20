const {Socket} = require('../../../../data_structures.cjs')

/** 
 * @param {Socket} socket 
 */
function WritePacket(socket) {
    if (socket.thisPlayer.upvn >= 16 && socket.thisPlayer.upvn <= 26) return require('./241.cjs').WritePacket
    else {
        socket.log(`ERR: Cannot Write Entity Packet for Version ${socket.thisPlayer.upvn}:${socket.thisPlayer.uvni}`)
        return () => {}
    }
}

module.exports = {WritePacket}