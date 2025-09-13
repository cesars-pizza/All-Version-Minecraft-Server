const {Socket} = require('../../../data_structures.cjs')

/** 
 * @param {Socket} socket 
 */
function WritePacket(socket) {
    if (socket.thisPlayer.upvn == -1) return require('./29.cjs').WritePacket
}

function WritePacket_Alt0(socket) {
    if (socket.thisPlayer.upvn == -1) return require('./29.cjs').WritePacket_Alt0
}

module.exports = {WritePacket, WritePacket_Alt0}