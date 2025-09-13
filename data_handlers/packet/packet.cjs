const {Socket} = require('../../data_structures.cjs')

/** 
 * @param {Socket} socket 
 */
function Write(socket, packetID, value) {
    if (socket.thisPlayer.upvn == -1) return require('./29.cjs').Write(socket, packetID, value)
    else {
        socket.log(`ERR: Cannot Write Packet for Version ${socket.thisPlayer.upvn}:${socket.thisPlayer.uvni}`)
        return [0]
    }
}

module.exports = {Write}