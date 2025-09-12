const {Socket} = require('../../data_structures')

function Write(value) {
    value = Math.min(Math.max(value, 0), 4294967295)

    return [
        (value & 0xFF000000) >> 24,
        (value & 0x00FF0000) >> 16,
        (value & 0x0000FF00) >> 8,
        (value & 0x000000FF) >> 0
    ]
}

module.exports = {Write}