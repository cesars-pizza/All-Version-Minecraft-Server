const {Socket} = require('../../../data_structures.cjs')

/** 
 * @param {Socket} socket 
 */
function WritePacket(socket) {
    if (socket.thisPlayer.upvn == -1) return require('./29.cjs').WritePacket
}

module.exports = {WritePacket}