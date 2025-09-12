const {Socket} = require('../../data_structures')

/**
 * @param {Buffer} data 
 * @param {number} position 
 */
function Read(data, position) {
    var stringValue = data.subarray(position, position + 64).toString('utf-8')
    stringValue = stringValue.trimEnd()

    return {
        value: stringValue,
        length: 64,
        nextPos: position + 64
    }
}

/**
 * @param {string} value 
 */
function Write(value) {
    if (value.length > 64) value = value.substring(0, 64)
    value = value.padEnd(64, ' ')
    return Array.from(Buffer.from(value, 'utf-8'))
}

module.exports = {Read, Write}