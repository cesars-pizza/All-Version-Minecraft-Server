const {Socket} = require('../../data_structures.cjs')

/** 
 * @param {Socket} socket 
 */
function Read(socket, data, position) {
    if (socket.thisPlayer.upvn == -1) return require('./29.cjs').Read(data, position)
    else {
        socket.log(`ERR: Cannot Parse Byte for Version ${socket.thisPlayer.upvn}:${socket.thisPlayer.uvni}`)
        return {
            value: 0,
            length: 1,
            nextPos: position + 1
        }
    }
}

/** 
 * @param {Socket} socket 
 */
function Write(socket, value) {
    if (socket.thisPlayer.upvn == -1) return require('./29.cjs').Write(value)
    else {
        socket.log(`ERR: Cannot Write Byte for Version ${socket.thisPlayer.upvn}:${socket.thisPlayer.uvni}`)
        return [0]
    }
}

module.exports = {Read, Write}