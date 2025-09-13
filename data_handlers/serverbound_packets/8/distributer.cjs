const {Socket} = require('../../../data_structures.cjs')

/** 
 * @param {Socket} socket 
 */
function ReadPacket(socket) {
    if (socket.upvn == -1) return require('./29.cjs').ReadPacket
}

module.exports = {ReadPacket}