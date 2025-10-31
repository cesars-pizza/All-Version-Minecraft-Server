const {Socket, Position, Rotation} = require('../../../../data_structures.cjs')
const utils = require('../../../../utils/utils.cjs')
const dataWriter = require('../../../data_writer.cjs')

var packetID = 8
var packetIdentifier = "Set Position and Orientation"

/** 
 * @param {Socket} socket 
 * @param {number} playerID 
 * @param {Position} position 
 * @param {Rotation} rotation 
 */
function WritePacket(socket, playerID, position, rotation) {
    var adjustedPosition = {
        x: utils.math.NegMod(position.x, 256),
        y: utils.math.NegMod(position.y, 256),
        z: utils.math.NegMod(position.z, 256)
    }
    var adjustedRotation = {
        pitch: utils.math.NegMod((rotation.pitch / 360) * 255, 256),
        yaw: utils.math.NegMod(((180 + rotation.yaw) / 360) * 255, 256)
    }

    if (playerID != -1 && (Math.floor(socket.thisPlayer.position.x / 256) != Math.floor(position.x / 256) || Math.floor(socket.thisPlayer.position.z / 256) != Math.floor(position.z / 256))) {
        adjustedPosition = {
            x: -1,
            y: 0,
            z: -1
        }
    }

    socket.writePacket(packetID, packetIdentifier, 
        dataWriter.writeByte(socket, playerID).concat(
            dataWriter.writeFixed5Short(socket, adjustedPosition.x - 0.015625),
            dataWriter.writeFixed5Short(socket, adjustedPosition.y + 1.59375),
            dataWriter.writeFixed5Short(socket, adjustedPosition.z - 0.015625),
            dataWriter.writeUByte(socket, adjustedRotation.yaw),
            dataWriter.writeUByte(socket, adjustedRotation.pitch)
        ), false, false)
}

module.exports = {WritePacket}