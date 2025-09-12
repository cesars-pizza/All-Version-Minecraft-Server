const {Socket} = require('../../data_structures')

/** 
 * @param {Socket} socket 
 */
function Read(socket, data, position) {
    socket.log(`ERR: Cannot Parse Gzip for Version ${socket.upvn}:${socket.uvni}`)
    return {
        value: [],
        length: 0,
        nextPos: position
    }
}

/** 
 * @param {Socket} socket 
 */
function Write(socket, data) {
    if (socket.upvn == -1) return require('./29').Write(data)
    else {
        socket.log(`ERR: Cannot Write Gzip for Version ${socket.upvn}:${socket.uvni}`)
        return []
    }
}

module.exports = {Read, Write}