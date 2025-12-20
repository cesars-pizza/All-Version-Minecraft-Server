const {Socket} = require('../../data_structures.cjs')

/** 
 * @param {Socket} socket 
 */
function Disconnect(socket) {
    if (socket.thisPlayer.upvn == -1) return require('./29.cjs').Disconnect
    else if (socket.thisPlayer.upvn >= 0 && socket.thisPlayer.upvn <= 1) return require('./42.cjs').Disconnect
    else if (socket.thisPlayer.upvn >= 2 && socket.thisPlayer.upvn <= 3) return require('./51.cjs').Disconnect
    else if (socket.thisPlayer.upvn == 4) return require('./79.cjs').Disconnect
    else if (socket.thisPlayer.upvn >= 8 && socket.thisPlayer.upvn <= 15) return require('./213.cjs').Disconnect
    else if (socket.thisPlayer.upvn >= 16 && socket.thisPlayer.upvn <= 26) return require('./241.cjs').Disconnect
    else {
        socket.log(`ERR: Cannot Run Disconnect for Version ${socket.thisPlayer.upvn}:${socket.thisPlayer.uvni}`)
        return () => {}
    }
}

module.exports = {Disconnect}