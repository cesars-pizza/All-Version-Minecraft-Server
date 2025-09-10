const {Socket} = require('../../data_structures')

/** 
 * @param {Socket} socket 
 */
function Read(socket, data, position) {
    if (socket.upvn == -1) return require('./29').Read(data, position)
    else {
        socket.log(`ERR: Cannot Parse String for Version ${socket.upvn}:${socket.uvni}`)
        return {
            value: "",
            length: 0,
            nextPos: position
        }
    }
}

function Write(socket, value) {
    if (socket.upvn == -1) return require('./29').Write(value)
    else {
        socket.log(`ERR: Cannot Write String for Version ${socket.upvn}:${socket.uvni}`)
        return []
    }
}

module.exports = {Read, Write}