const {Socket} = require('../../data_structures')

function Read(data, position) {
    return {
        value: data[position],
        length: 1,
        nextPos: position + 1
    }
}

module.exports = {Read}