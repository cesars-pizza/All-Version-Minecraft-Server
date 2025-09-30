const {Socket} = require('../../data_structures.cjs')

/** 
 * @param {Socket} socket 
 */
function Read(socket, data, position) {
    socket.log(`ERR: Cannot Parse Level Data for Version ${socket.thisPlayer.upvn}:${socket.thisPlayer.uvni}`)
    return {
        value: [[[]]],
        length: 1024,
        nextPos: position + 1024
    }
}

/** 
 * @param {Socket} socket 
 */
function Write(socket, value) {
    if (socket.thisPlayer.upvn >= -1 && socket.thisPlayer.upvn <= 4) return require('./29.cjs').Write(socket, value)
    if (socket.thisPlayer.upvn >= 8 && socket.thisPlayer.upvn <= 15) return require('./213.cjs').Write(socket, value.blocks, value.blockMeta, value.blockLight, value.skyLight)
    else {
        socket.log(`ERR: Cannot Write Level Data for Version ${socket.thisPlayer.upvn}:${socket.thisPlayer.uvni}`)
        return []
    }
}

module.exports = {Read, Write}