const {Socket} = require('../../../data_structures')
const dataWriter = require('../../data_writer')

var packetID = 7
var packetIdentifier = "Spawn Player"

/** 
 * @param {Socket} socket
 */
function WritePacket(socket, playerID, playerName, position, rotation) {
    socket.writePacket(packetID, packetIdentifier, dataWriter.writeByte(socket, playerID).concat(
        dataWriter.writeString(socket, playerName),
        dataWriter.writeFixed5Short(socket, position.x),
        dataWriter.writeFixed5Short(socket, position.y),
        dataWriter.writeFixed5Short(socket, position.z),
        dataWriter.writeUByte(socket, rotation.yaw),
        dataWriter.writeUByte(socket, rotation.pitch),
    ))
}

module.exports = {WritePacket}