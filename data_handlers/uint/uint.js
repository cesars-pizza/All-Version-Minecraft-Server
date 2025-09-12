const {Socket} = require('../../data_structures')

/** 
 * @param {Socket} socket 
 */
function Read(socket, data, position) {
    socket.log(`ERR: Cannot Parse UInt for Version ${socket.upvn}:${socket.uvni}`)
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
    if (socket.upvn == -1) return require('./29').Write(value)
    else {
        socket.log(`ERR: Cannot Write UInt for Version ${socket.upvn}:${socket.uvni}`)
        return [0, 0, 0, 0]
    }
}

module.exports = {Read, Write}