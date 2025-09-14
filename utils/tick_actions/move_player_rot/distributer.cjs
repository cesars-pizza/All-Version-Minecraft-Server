const {Socket} = require('../../../data_structures.cjs')

/** 
 * @param {Socket} socket 
 */
function MovePlayer(socket) {
    if (socket.thisPlayer.upvn == -1) return require('./29.cjs').MovePlayer
}

module.exports = {MovePlayer}