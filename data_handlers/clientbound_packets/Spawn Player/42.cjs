const {Socket} = require('../../../data_structures.cjs')
const dataWriter = require('../../data_writer.cjs')

var packetID = 7
var packetIdentifier = "Spawn Player"

/** 
 * @param {Socket} socket
 */
function WritePacket(socket, playerID, playerName, position, rotation) {
    if (playerID != -1 && playerID != 255) {
        socket.writePacket(packetID, packetIdentifier, dataWriter.writeByte(socket, playerID).concat(
            dataWriter.writeString(socket, playerName),
            dataWriter.writeFixed5Short(socket, position.x - 0.015625),
            dataWriter.writeFixed5Short(socket, position.y + 1.59375),
            dataWriter.writeFixed5Short(socket, position.z - 0.015625),
            dataWriter.writeUByte(socket, rotation.yaw),
            dataWriter.writeUByte(socket, rotation.pitch),
        ))
    } else {
        socket.writePacket(packetID, packetIdentifier, dataWriter.writeByte(socket, playerID).concat(
            dataWriter.writeString(socket, playerName),
            dataWriter.writeFixed5Short(socket, position.x - 0.015625),
            dataWriter.writeFixed5Short(socket, position.y + 1.59375),
            dataWriter.writeFixed5Short(socket, position.z - 0.015625),
            dataWriter.writeUByte(socket, 256 - rotation.pitch),
            dataWriter.writeUByte(socket, rotation.yaw),
        ))
    }
}

module.exports = {WritePacket}