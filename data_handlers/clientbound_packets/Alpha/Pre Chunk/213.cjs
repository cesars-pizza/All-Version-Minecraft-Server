const {Socket} = require('../../../../data_structures.cjs')
const dataWriter = require('../../../data_writer.cjs')

var packetID = 50
var packetIdentifier = "Pre-Chunk"

/** 
 * @param {Socket} socket
 */
function WritePacket(socket, chunkX, chunkZ, initilize) {
    socket.writePacket(packetID, packetIdentifier, dataWriter.writeInt(socket, chunkX).concat(
        dataWriter.writeInt(socket, chunkZ),
        dataWriter.writeBool(socket, initilize)
    ))
}

module.exports = {WritePacket}