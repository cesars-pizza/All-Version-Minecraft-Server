const {Socket} = require('../../data_structures.cjs')

/** 
 * @param {Socket} socket 
 */
function Disconnect(socket) {
    if (socket.thisPlayer.upvn == -1) return require('./29.cjs').Disconnect
}

module.exports = {Disconnect}