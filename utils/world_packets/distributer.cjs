const {Socket} = require('../../data_structures.cjs')

/** 
 * @param {Socket} socket 
 */
function GenerateBlocks(socket) {
    if (socket.thisPlayer.upvn >= -1 && socket.thisPlayer.upvn <= 4) return require('./29.cjs').GenerateBlocks
    else if (socket.thisPlayer.upvn >= 8 && socket.thisPlayer.upvn <= 15) return require('./213.cjs').GenerateBlocks
    else if (socket.thisPlayer.upvn >= 16 && socket.thisPlayer.upvn <= 26) return require('./241.cjs').GenerateBlocks
    else {
        socket.log(`ERR: Cannot Write Generate Blocks World Packets for Version ${socket.thisPlayer.upvn}:${socket.thisPlayer.uvni}`)
        return () => {}
    }
}

/** 
 * @param {Socket} socket 
 */
function GenerateRenderDistance(socket) {
    if (socket.thisPlayer.upvn >= 8 && socket.thisPlayer.upvn <= 15) return require('./213.cjs').GenerateRenderDistance
    else if (socket.thisPlayer.upvn >= 16 && socket.thisPlayer.upvn <= 26) return require('./241.cjs').GenerateRenderDistance
    else {
        socket.log(`ERR: Cannot Write Generate Render Distance World Packets for Version ${socket.thisPlayer.upvn}:${socket.thisPlayer.uvni}`)
        return () => {}
    }
}

module.exports = {GenerateBlocks, GenerateRenderDistance}