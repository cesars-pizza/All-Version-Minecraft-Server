const {Socket} = require('../../../../data_structures.cjs')

/** 
 * @param {Socket} socket 
 */
function WritePacket(socket) {
    if (socket.thisPlayer.upvn >= 8 && socket.thisPlayer.upvn <= 11) return require('./213.cjs').WritePacket
    if (socket.thisPlayer.upvn >= 12 && socket.thisPlayer.upvn <= 15) return require('./227.cjs').WritePacket
    else {
        socket.log(`ERR: Cannot Write Login Response Packet for Version ${socket.thisPlayer.upvn}:${socket.thisPlayer.uvni}`)
        return () => {}
    }
}

module.exports = {WritePacket}