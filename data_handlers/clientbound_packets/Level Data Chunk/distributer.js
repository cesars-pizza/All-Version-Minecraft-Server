const {Socket} = require('../../../data_structures')

/** 
 * @param {Socket} socket 
 */
function WritePacket(socket) {
    if (socket.upvn == -1) return require('./29').WritePacket
}

function WritePacket_Alt0(socket) {
    if (socket.upvn == -1) return require('./29').WritePacket_Alt0
}

module.exports = {WritePacket, WritePacket_Alt0}