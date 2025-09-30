const {Socket} = require('../../../data_structures.cjs')
const dataWriter = require('../../data_writer.cjs')

var packetID = 51
var packetIdentifier = "Map Chunk"

/** 
 * @param {Socket} socket
 */
function WritePacket(socket, chunkX, chunkZ, levelData) {
    socket.writePacket(packetID, packetIdentifier, dataWriter.writeInt(socket, chunkX * 16).concat(
        dataWriter.writeShort(socket, 0),
        dataWriter.writeInt(socket, chunkZ * 16),
        dataWriter.writeByte(socket, 15),
        dataWriter.writeByte(socket, 127),
        dataWriter.writeByte(socket, 15),
        dataWriter.writeInt(socket, levelData.length),
        levelData
    ))
}

module.exports = {WritePacket}