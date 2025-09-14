const {Socket, Position, Rotation} = require('../../../data_structures.cjs')
const dataWriter = require('../../data_writer.cjs')

var packetID = 8
var packetIdentifier = "Set Position and Orientation"

/** 
 * @param {Socket} socket 
 * @param {number} playerID 
 * @param {Position} position 
 * @param {Rotation} rotation 
 */
function WritePacket(socket, playerID, position, rotation) {
    socket.writePacket(packetID, packetIdentifier, 
        dataWriter.writeByte(socket, playerID).concat(
            dataWriter.writeFixed5Short(socket, position.x - 0.015625),
            dataWriter.writeFixed5Short(socket, position.y + 1.59375),
            dataWriter.writeFixed5Short(socket, position.z - 0.015625),
            dataWriter.writeUByte(socket, rotation.yaw),
            dataWriter.writeUByte(socket, rotation.pitch)
        ), false, false)
}

module.exports = {WritePacket}