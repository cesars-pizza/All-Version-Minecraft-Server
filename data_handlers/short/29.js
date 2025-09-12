const {Socket} = require('../../data_structures')

function Write(value) {
    if (value < 0) value += 65536
    value = Math.min(Math.max(value, 0), 65535)

    return [
        (value & 0xFF00) >> 8,
        (value & 0x00FF) >> 0
    ]
}

module.exports = {Write}