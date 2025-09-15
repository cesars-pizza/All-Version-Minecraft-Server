const {Socket} = require('../../../data_structures.cjs')

/** 
 * @param {Socket} socket 
 */
function DespawnPlayer(socket) {
    if (socket.thisPlayer.upvn >= -1 && socket.thisPlayer.upvn <= 4) return require('./29.cjs').DespawnPlayer
    else {
        socket.log(`ERR: Cannot Run Despawn Player for Version ${socket.thisPlayer.upvn}:${socket.thisPlayer.uvni}`)
        return () => {}
    }
}

module.exports = {DespawnPlayer}