const {Socket} = require('../../../data_structures.cjs')

/** 
 * @param {Socket} socket 
 */
function Message(socket) {
    if (socket.thisPlayer.upvn >= 0 && socket.thisPlayer.upvn <= 4) return require('./42.cjs').Message
    else {
        socket.log(`ERR: Cannot Run Message for Version ${socket.thisPlayer.upvn}:${socket.thisPlayer.uvni}`)
        return () => {}
    }
}

module.exports = {Message}