const {Socket} = require('../../../data_structures')

/** 
 * @param {Socket} socket 
 */
function ReadPacket(socket) {
    if (socket.upvn == -1) return require('./29').ReadPacket
}

module.exports = {ReadPacket}