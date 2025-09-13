const {Socket} = require('../../data_structures.cjs')
const dataWriter = require('../data_writer.cjs')

function Write(socket, packetID, data) {
    return Uint8Array.from(dataWriter.writeUByte(socket, packetID).concat(data))
}

module.exports = {Write}