const {Socket} = require('../../../data_structures.cjs')

/** 
 * @param {Socket} socket 
 */
function SetBlock(socket) {
    if (socket.thisPlayer.upvn >= -1 && socket.thisPlayer.upvn <= 4) return require('./29.cjs').SetBlock
    else {
        socket.log(`ERR: Cannot Run Set Block for Version ${socket.thisPlayer.upvn}:${socket.thisPlayer.uvni}`)
        return () => {}
    }
}

/** 
 * @param {Socket} socket 
 */
function AddBlockUpdate(socket) {
    return require('./29.cjs').AddBlockUpdate
}

/** 
 * @param {Socket} socket 
 */
function GetBlockUpdate(socket) {
    return require('./29.cjs').GetBlockUpdate
}

module.exports = {SetBlock, AddBlockUpdate, GetBlockUpdate}