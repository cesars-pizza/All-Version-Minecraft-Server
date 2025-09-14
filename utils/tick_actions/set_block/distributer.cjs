const {Socket} = require('../../../data_structures.cjs')

/** 
 * @param {Socket} socket 
 */
function SetBlock(socket) {
    if (socket.thisPlayer.upvn == -1) return require('./29.cjs').SetBlock
}

/** 
 * @param {Socket} socket 
 */
function AddBlockUpdate(socket) {
    if (socket.thisPlayer.upvn == -1) return require('./29.cjs').AddBlockUpdate
}

module.exports = {SetBlock, AddBlockUpdate}