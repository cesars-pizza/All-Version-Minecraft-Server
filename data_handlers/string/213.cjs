const {Socket} = require('../../data_structures.cjs')
const data_reader = require('../data_reader.cjs')
const data_writer = require('../data_writer.cjs')

/**
 * @param {Buffer} data 
 * @param {number} position 
 */
function Read(data, position) {
    var length = data_reader.readShort({uvni: -1}, data, position)
    if (isNaN(length.value) || data.length < (length.nextPos + length.value) || length.value < 0) return {
        value: undefined,
        length: 0,
        nextPos: position
    }
    else {
        return {
            value: Buffer.from(Array.from(data).slice(length.nextPos, length.nextPos + length.value)).toString('utf8'),
            length: length.length + length.value,
            nextPos: length.nextPos + length.value
        }
    }
}

/**
 * @param {string} value 
 */
function Write(value) {
    var text = Array.from(Uint8Array.from(Buffer.from(value, 'utf8')))
    var length = data_writer.writeShort({uvni: -1}, text.length)

    return length.concat(text)
}

module.exports = {Read, Write}