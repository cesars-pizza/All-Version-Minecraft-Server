const {Socket} = require('../../../data_structures.cjs')

/** 
 * @param {Socket} socket 
 */
function SpawnPlayer(socket) {
    if (socket.thisPlayer.upvn == -1) return require('./29.cjs').SpawnPlayer
}

module.exports = {SpawnPlayer}