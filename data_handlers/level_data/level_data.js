const {Socket} = require('../../data_structures')

/** 
 * @param {Socket} socket 
 */
function Read(socket, data, position) {
    socket.log(`ERR: Cannot Parse Level Data for Version ${socket.upvn}:${socket.uvni}`)
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
    if (socket.upvn == -1) return require('./29').Write(socket, value)
    else {
        socket.log(`ERR: Cannot Write Level Data for Version ${socket.upvn}:${socket.uvni}`)
        return []
    }
}

module.exports = {Read, Write}