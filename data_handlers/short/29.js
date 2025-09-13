const {Socket} = require('../../data_structures')

function Read(data, position) {
    var value = data[position] * 256 + data[position + 1]
    if (value > 32767) value -= 65536

    return {
        value: value,
        length: 2,
        nextPos: position + 2
    }
}

function Write(value) {
    if (value < 0) value += 65536
    value = Math.min(Math.max(value, 0), 65535)

    return [
        (value & 0xFF00) >> 8,
        (value & 0x00FF) >> 0
    ]
}

module.exports = {Read, Write}