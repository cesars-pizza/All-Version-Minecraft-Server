const {Socket} = require('../../data_structures.cjs')

/** 
 * @param {Socket} socket 
 */
function Read(socket, data, position) {
    return require('./29.cjs').Read(data)
}

/** 
 * @param {Socket} socket 
 */
function Write(socket, data) {
    return require('./29.cjs').Write(data)
}

module.exports = {Read, Write}