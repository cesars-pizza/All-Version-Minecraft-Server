const {Socket} = require('../../../data_structures.cjs')

/** 
 * @param {Socket} socket 
 */
function DespawnPlayer(socket) {
    if (socket.thisPlayer.upvn >= -1 && socket.thisPlayer.upvn <= 4) return require('./29.cjs').DespawnPlayer
    if (socket.thisPlayer.upvn >= 8 && socket.thisPlayer.upvn <= 15) return require('./213.cjs').DespawnPlayer
    if (socket.thisPlayer.upvn >= 16 && socket.thisPlayer.upvn <= 26) return require('./241.cjs').DespawnPlayer
    else {
        socket.log(`ERR: Cannot Run Despawn Player for Version ${socket.thisPlayer.upvn}:${socket.thisPlayer.uvni}`)
        return () => {}
    }
}

module.exports = {DespawnPlayer}