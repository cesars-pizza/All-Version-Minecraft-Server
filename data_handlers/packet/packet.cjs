const {Socket} = require('../../data_structures.cjs')

/** 
 * @param {Socket} socket 
 */
function Write(socket, packetID, value) {
    if (socket.thisPlayer.upvn >= -1 && socket.thisPlayer.upvn <= 26) return require('./29.cjs').Write(socket, packetID, value)
    else {
        socket.log(`ERR: Cannot Write Packet for Version ${socket.thisPlayer.upvn}:${socket.thisPlayer.uvni}`)
        return new Uint8Array()
    }
}

module.exports = {Write}