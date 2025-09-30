const {Socket} = require('../../data_structures.cjs')

function Read(data, position) {
    return {
        value: data[position] == 1,
        length: 1,
        nextPos: position + 1
    }
}

function Write(value) {
    if (value) return [1]
    else return [0]
}

module.exports = {Read, Write}