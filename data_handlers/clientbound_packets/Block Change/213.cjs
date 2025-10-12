const {Socket, Position} = require('../../../data_structures.cjs')
const dataWriter = require('../../data_writer.cjs')
const utils = require('../../../utils/utils.cjs')

var packetID = 53
var packetIdentifier = "Block Change"

/** 
 * @param {Socket} socket 
 * @param {Position} position 
 */
function WritePacket(world, socket, position, block, blockMeta, doubleSet) {
    if (doubleSet) {
        socket.writePacket(packetID, packetIdentifier, dataWriter.writeInt(socket, position.x).concat(
            dataWriter.writeByte(socket, position.y),
            dataWriter.writeInt(socket, position.z),
            dataWriter.writeByte(socket, 1),
            dataWriter.writeByte(socket, 0)
        ))
    }
    socket.writePacket(packetID, packetIdentifier, dataWriter.writeInt(socket, position.x).concat(
        dataWriter.writeByte(socket, position.y),
        dataWriter.writeInt(socket, position.z),
        dataWriter.writeByte(socket, block),
        dataWriter.writeByte(socket, blockMeta)
    ))
}

module.exports = {WritePacket}