const {Socket} = require('../../data_structures')

/** 
 * @param {Socket} socket 
 */
function Read(socket, data, position) {
    if (socket.upvn == -1) return require('./29').Read(data, position)
    else {
        socket.log(`ERR: Cannot Parse Short for Version ${socket.upvn}:${socket.uvni}`)
        return {
            value: 0,
            length: 2,
            nextPos: position + 2
        }
    }
}

/** 
 * @param {Socket} socket 
 */
function Write(socket, value) {
    if (socket.upvn == -1) return require('./29').Write(value)
    else {
        socket.log(`ERR: Cannot Write Short for Version ${socket.upvn}:${socket.uvni}`)
        return [0, 0]
    }
}

module.exports = {Read, Write}