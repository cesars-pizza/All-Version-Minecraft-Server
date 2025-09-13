const {Socket} = require('../../data_structures.cjs')

/** 
 * @param {Socket} socket 
 */
function GenerateBlocks(socket) {
    if (socket.thisPlayer.upvn == -1) return require('./29.cjs').GenerateBlocks
}

/** 
 * @param {Socket} socket 
 */
function GenerateClassicWorld(socket) {
    if (socket.thisPlayer.upvn == -1) return require('./29.cjs').GenerateClassicWorld
}

module.exports = {GenerateBlocks, GenerateClassicWorld}