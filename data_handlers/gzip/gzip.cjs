const {Socket} = require('../../data_structures.cjs')

/** 
 * @param {Socket} socket 
 */
function Read(socket, data, position) {
    socket.log(`ERR: Cannot Parse Gzip for Version ${socket.thisPlayer.upvn}:${socket.thisPlayer.uvni}`)
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
    if (socket.thisPlayer.upvn == -1) return require('./29.cjs').Write(data)
    else {
        socket.log(`ERR: Cannot Write Gzip for Version ${socket.thisPlayer.upvn}:${socket.thisPlayer.uvni}`)
        return []
    }
}

module.exports = {Read, Write}