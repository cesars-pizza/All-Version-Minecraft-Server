const {Socket} = require('../../data_structures.cjs')

/** 
 * @param {Socket} socket 
 */
function GenerateBlocks(socket) {
    if (socket.thisPlayer.upvn >= -1 && socket.thisPlayer.upvn <= 4) return require('./29.cjs').GenerateBlocks
    if (socket.thisPlayer.upvn >= 8 && socket.thisPlayer.upvn <= 10) return require('./213.cjs').GenerateBlocks
    if (socket.thisPlayer.upvn >= 11 && socket.thisPlayer.upvn <= 15) return require('./222.cjs').GenerateBlocks
    else {
        socket.log(`ERR: Cannot Run Generate Blocks Util for Version ${socket.thisPlayer.upvn}:${socket.thisPlayer.uvni}`)
        return () => {}
    }
}

/** 
 * @param {Socket} socket 
 */
function GenerateClassicWorld(socket) {
    if (socket.thisPlayer.upvn >= -1 && socket.thisPlayer.upvn <= 4) return require('./29.cjs').GenerateClassicWorld
    else {
        socket.log(`ERR: Cannot Run Generate Classic World Util for Version ${socket.thisPlayer.upvn}:${socket.thisPlayer.uvni}`)
        return () => {}
    }
}

/** 
 * @param {Socket} socket 
 */
function GetBlock(socket) {
    if (socket.thisPlayer.upvn >= -1 && socket.thisPlayer.upvn <= 4) return require('./29.cjs').GetBlock
    if (socket.thisPlayer.upvn >= 8 && socket.thisPlayer.upvn <= 10) return require('./213.cjs').GetBlock
    if (socket.thisPlayer.upvn >= 11 && socket.thisPlayer.upvn <= 15) return require('./222.cjs').GetBlock
    else {
        socket.log(`ERR: Cannot Run Get Block World Util for Version ${socket.thisPlayer.upvn}:${socket.thisPlayer.uvni}`)
        return () => {}
    }
}

module.exports = {GenerateBlocks, GenerateClassicWorld, GetBlock}