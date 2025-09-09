const {Socket} = require('../../data_structures')

/** 
 * @param {Socket} socket 
 */
function Read(socket, data, position) {
    if (socket.upvn == -1) return require('./29').Read(data, position)
    else return {
        value: undefined,
        length: 0,
        nextPos: position
    }
}

module.exports = {Read}