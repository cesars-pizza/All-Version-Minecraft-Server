const {Socket} = require('../../../data_structures.cjs')

/** 
 * @param {Socket} socket 
 */
function WritePacket(socket) {
    if (socket.thisPlayer.uvni >= 29 && socket.thisPlayer.uvni <= 43) return require('./29.cjs').WritePacket
    else {
        socket.log(`ERR: Cannot Write Set Position and Orientation Packet for Version ${socket.thisPlayer.upvn}:${socket.thisPlayer.uvni}`)
        return () => {}
    }
}

module.exports = {WritePacket}