const {Socket} = require('../../../data_structures.cjs')

/** 
 * @param {Socket} socket 
 */
function SetTime(socket) {
    if (socket.thisPlayer.upvn >= 10 && socket.thisPlayer.upvn <= 15) return require('./219.cjs').SetTime
    if (socket.thisPlayer.upvn >= 16 && socket.thisPlayer.upvn <= 26) return require('./241.cjs').SetTime
    else {
        socket.log(`ERR: Cannot Run Set Time for Version ${socket.thisPlayer.upvn}:${socket.thisPlayer.uvni}`)
        return () => {}
    }
}

module.exports = {SetTime}