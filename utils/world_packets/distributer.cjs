const {Socket} = require('../../data_structures.cjs')

/** 
 * @param {Socket} socket 
 */
function GenerateBlocks(socket) {
    if (socket.thisPlayer.upvn >= -1 && socket.thisPlayer.upvn <= 4) return require('./29.cjs').GenerateBlocks
    else {
        socket.log(`ERR: Cannot Run World Packets Util for Version ${socket.thisPlayer.upvn}:${socket.thisPlayer.uvni}`)
        return () => {}
    }
}

module.exports = {GenerateBlocks}