const {Socket} = require('../../data_structures.cjs')

/**
 * @param {Buffer} data 
 * @param {number} position
 */
function Read(data, position) {
    return {
        value: data.readDoubleBE(position),
        length: 8,
        nextPos: position + 8
    }
}

function Write(value) {
    var buf = Buffer.allocUnsafe(8)
    buf.writeDoubleBE(value, 0)
    return Array.from(buf)
}

module.exports = {Read, Write}