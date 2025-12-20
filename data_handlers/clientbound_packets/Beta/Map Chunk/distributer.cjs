const {Socket} = require('../../../../data_structures.cjs')

/** 
 * @param {Socket} socket 
 */
function WritePacket(socket) {
    if (socket.thisPlayer.upvn >= 16 && socket.thisPlayer.upvn <= 26) return require('./241.cjs').WritePacket
    else {
        socket.log(`ERR: Cannot Write Map Chunk Packet for Version ${socket.thisPlayer.upvn}:${socket.thisPlayer.uvni}`)
        return () => {}
    }
}

/** 
 * @param {Socket} socket 
 */
function WritePacket_Alt0(socket) {
    if (socket.thisPlayer.upvn >= 16 && socket.thisPlayer.upvn <= 26) return require('./241.cjs').WritePacket_Alt0
    else {
        socket.log(`ERR: Cannot Write Map Chunk Packet for Version ${socket.thisPlayer.upvn}:${socket.thisPlayer.uvni}`)
        return () => {}
    }
}

module.exports = {WritePacket, WritePacket_Alt0}