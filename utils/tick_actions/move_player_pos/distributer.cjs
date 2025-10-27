const {Socket} = require('../../../data_structures.cjs')

/** 
 * @param {Socket} socket 
 */
function MovePlayer(socket) {
    if (socket.thisPlayer.upvn >= -1 && socket.thisPlayer.upvn <= 4) return require('./29.cjs').MovePlayer
    if (socket.thisPlayer.upvn >= 8 && socket.thisPlayer.upvn <= 15) return require('./213.cjs').MovePlayer
    else {
        socket.log(`ERR: Cannot Run Move Player Pos for Version ${socket.thisPlayer.upvn}:${socket.thisPlayer.uvni}`)
        return () => {}
    }
}

module.exports = {MovePlayer}