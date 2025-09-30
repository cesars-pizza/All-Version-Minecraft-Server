const {Socket} = require('../../data_structures.cjs')

/** 
 * @param {Socket} socket 
 */
function Read(socket, data, position) {
    if (socket.thisPlayer.upvn >= -1 && socket.thisPlayer.upvn <= 4) return require('./29.cjs').Read(data, position)
    if (socket.thisPlayer.upvn >= 8 && socket.thisPlayer.upvn <= 15) return require('./213.cjs').Read(data, position)
    else {
        socket.log(`ERR: Cannot Parse String for Version ${socket.thisPlayer.upvn}:${socket.thisPlayer.uvni}`)
        return {
            value: "",
            length: 0,
            nextPos: position
        }
    }
}

function Write(socket, value) {
    if (socket.thisPlayer.upvn >= -1 && socket.thisPlayer.upvn <= 4) return require('./29.cjs').Write(value)
    if (socket.thisPlayer.upvn >= 8 && socket.thisPlayer.upvn <= 15) return require('./213.cjs').Write(value)
    else {
        socket.log(`ERR: Cannot Write String for Version ${socket.thisPlayer.upvn}:${socket.thisPlayer.uvni}`)
        return []
    }
}

module.exports = {Read, Write}