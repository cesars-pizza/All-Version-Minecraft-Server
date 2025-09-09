const {Socket} = require('../../data_structures')

/**
 * @param {Buffer} data 
 * @param {number} position 
 * @returns 
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

module.exports = {Read}