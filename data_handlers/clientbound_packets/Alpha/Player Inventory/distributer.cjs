const {Socket} = require('../../../../data_structures.cjs')

/** 
 * @param {Socket} socket 
 */
function WritePacket(socket) {
    if (socket.thisPlayer.upvn >= 11 && socket.thisPlayer.upvn <= 15) return require('./222.cjs').WritePacket
    else {
        socket.log(`ERR: Cannot Write Player Inventory Packet for Version ${socket.thisPlayer.upvn}:${socket.thisPlayer.uvni}`)
        return () => {}
    }
}

module.exports = {WritePacket}