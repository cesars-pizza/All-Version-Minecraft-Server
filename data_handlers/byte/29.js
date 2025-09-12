const {Socket} = require('../../data_structures')

function Read(data, position) {
    return {
        value: data[position],
        length: 1,
        nextPos: position + 1
    }
}

function Write(value) {
    if (value < 0) value += 256
    value = Math.min(Math.max(value, 0), 255)

    return [value]
}

module.exports = {Read, Write}