const {Socket} = require('../../../data_structures.cjs')

/**
 * @param {Buffer} data 
 * @param {number} position
 */
function Read(data, position) {
    return {
        value: data.readFloatBE(position),
        length: 4,
        nextPos: position + 4
    }
}

function Write(value) {
    var buf = Buffer.allocUnsafe(4)
    buf.writeFloatBE(value, 0)
    return Array.from(buf)
}

module.exports = {Read, Write}