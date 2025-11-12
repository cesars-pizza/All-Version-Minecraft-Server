const {Socket} = require('../../../data_structures.cjs')

/** 
 * @param {Socket} socket 
 */
function Read(socket, data, position) {
    return require('./213.cjs').Read(data, position)
}

/** 
 * @param {Socket} socket 
 */
function Write(socket, value) {
    return require('./213.cjs').Write(value)
}

module.exports = {Read, Write}