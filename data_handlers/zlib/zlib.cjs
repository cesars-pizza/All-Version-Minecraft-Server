const {Socket} = require('../../data_structures.cjs')

/** 
 * @param {Socket} socket 
 */
function Read(socket, data, position) {
    socket.log(`ERR: Cannot Parse ZLib for Version ${socket.thisPlayer.upvn}:${socket.thisPlayer.uvni}`)
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
    return require('./213.cjs').Write(data)
}

module.exports = {Read, Write}