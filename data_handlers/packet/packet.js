const {Socket} = require('../../data_structures')

/** 
 * @param {Socket} socket 
 */
function Write(socket, packetID, value) {
    if (socket.upvn == -1) return require('./29').Write(socket, packetID, value)
    else {
        socket.log(`ERR: Cannot Write Packet for Version ${socket.upvn}:${socket.uvni}`)
        return [0]
    }
}

module.exports = {Write}