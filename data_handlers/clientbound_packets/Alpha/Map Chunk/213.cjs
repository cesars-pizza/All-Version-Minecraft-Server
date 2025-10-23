const {Socket} = require('../../../../data_structures.cjs')
const dataWriter = require('../../../data_writer.cjs')

var packetID = 51
var packetIdentifier = "Map Chunk"

/** 
 * @param {Socket} socket
 */
function WritePacket(socket, chunkX, chunkZ, sizeX, sizeZ, levelData) {
    socket.writePacket(packetID, packetIdentifier, dataWriter.writeInt(socket, chunkX * 16).concat(
        dataWriter.writeShort(socket, 0),
        dataWriter.writeInt(socket, chunkZ * 16),
        dataWriter.writeByte(socket, sizeX * 16 - 1),
        dataWriter.writeByte(socket, 127),
        dataWriter.writeByte(socket, sizeZ * 16 - 1),
        dataWriter.writeInt(socket, levelData.length),
        levelData
    ), false, false)
}

/** 
 * @param {Socket} socket
 */
function WritePacket_Alt0(socket, blockPos, id, meta) {
    var levelData = dataWriter.writeZlib(socket, [id, 0, meta, 0, 15])

    socket.writePacket(packetID, packetIdentifier, dataWriter.writeInt(socket, blockPos.x).concat(
        dataWriter.writeShort(socket, blockPos.y),
        dataWriter.writeInt(socket, blockPos.z),
        dataWriter.writeByte(socket, 1),
        dataWriter.writeByte(socket, 2),
        dataWriter.writeByte(socket, 1),
        dataWriter.writeInt(socket, levelData.length),
        levelData
    ), false, false)
}

module.exports = {WritePacket, WritePacket_Alt0}