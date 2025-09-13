const {Socket} = require('../../data_structures.cjs')

/** 
 * @param {Socket} socket 
 */
function Read(socket, data, position) {
    socket.log(`ERR: Cannot Parse UInt for Version ${socket.thisPlayer.upvn}:${socket.thisPlayer.uvni}`)
    return {
        value: 0,
        length: 4,
        nextPos: position + 4
    }
}

/** 
 * @param {Socket} socket 
 */
function Write(socket, value) {
    if (socket.thisPlayer.upvn == -1) return require('./29.cjs').Write(value)
    else {
        socket.log(`ERR: Cannot Write UInt for Version ${socket.thisPlayer.upvn}:${socket.thisPlayer.uvni}`)
        return [0, 0, 0, 0]
    }
}

module.exports = {Read, Write}