const {Socket} = require('../../../data_structures.cjs')

function Read(data, position) {
    var value = 0
    value += data[position] * 16777216
    value += data[position + 1] * 65536
    value += data[position + 2] * 256
    value += data[position + 3]
    if (value > 2147483647) value -= 4294967296

    return {
        value: value,
        length: 4,
        nextPos: position + 4
    }
}

function Write(value) {
    if (value < 0) value += 4294967296

    var bytes = [
        (value & 0xFF000000) / 0x01000000,
        (value & 0x00FF0000) / 0x00010000,
        (value & 0x0000FF00) / 0x00000100,
        (value & 0x000000FF) / 0x00000001,
    ]

    return bytes
}

module.exports = {Read, Write}