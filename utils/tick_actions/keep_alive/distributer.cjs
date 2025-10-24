const {Socket} = require('../../../data_structures.cjs')

/** 
 * @param {Socket} socket 
 */
function KeepAlive(socket) {
    if (socket.thisPlayer.upvn >= -1 && socket.thisPlayer.upvn <= 4) return require('./29.cjs').KeepAlive
    if (socket.thisPlayer.upvn >= 8 && socket.thisPlayer.upvn <= 15) return require('./213.cjs').KeepAlive
    else {
        socket.log(`ERR: Cannot Run Keep Alive for Version ${socket.thisPlayer.upvn}:${socket.thisPlayer.uvni}`)
        return () => {}
    }
}

module.exports = {KeepAlive}