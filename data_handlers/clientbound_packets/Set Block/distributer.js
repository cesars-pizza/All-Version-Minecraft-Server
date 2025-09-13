const {Socket} = require('../../../data_structures')

/** 
 * @param {Socket} socket 
 */
function WritePacket(socket) {
    if (socket.upvn == -1) return require('./29').WritePacket
}

module.exports = {WritePacket}