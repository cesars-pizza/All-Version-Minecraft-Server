const {Socket} = require('../../data_structures')

/** 
 * @param {Socket} socket 
 */
function Read(socket, data, position) {
    if (socket.upvn == -1) return require('./29').Read(data, position)
    else {
        socket.log(`ERR: Cannot Parse Byte for Version ${socket.upvn}:${socket.uvni}`)
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
    if (socket.upvn == -1) return require('./29').Write(value)
    else {
        socket.log(`ERR: Cannot Write Byte for Version ${socket.upvn}:${socket.uvni}`)
        return [0]
    }
}

module.exports = {Read, Write}