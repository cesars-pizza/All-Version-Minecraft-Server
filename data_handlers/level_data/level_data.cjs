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
    if (socket.thisPlayer.upvn == -1) return require('./29.cjs').Write(socket, value)
    else {
        socket.log(`ERR: Cannot Write Level Data for Version ${socket.thisPlayer.upvn}:${socket.thisPlayer.uvni}`)
        return []
    }
}

module.exports = {Read, Write}