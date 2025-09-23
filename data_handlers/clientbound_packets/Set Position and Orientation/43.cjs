const {Socket, Position, Rotation} = require('../../../data_structures.cjs')
const utils = require('../../../utils/utils.cjs')
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
    var adjustedPosition = position
    if (playerID == -1) {
        adjustedPosition = {
            x: utils.math.NegMod(position.x, 256),
            y: utils.math.NegMod(position.y, 256),
            z: utils.math.NegMod(position.z, 256)
        }
    } else {
        if (Math.floor(socket.thisPlayer.position.x / 256) != Math.floor(position.x / 256) || Math.floor(socket.thisPlayer.position.z / 256) != Math.floor(position.z / 256)) {
            adjustedPosition = {
                x: -1,
                y: 0,
                z: -1
            }
        } 
    }

    socket.writePacket(packetID, packetIdentifier, 
        dataWriter.writeByte(socket, playerID).concat(
            dataWriter.writeFixed5Short(socket, adjustedPosition.x),
            dataWriter.writeFixed5Short(socket, adjustedPosition.y + 1.59375),
            dataWriter.writeFixed5Short(socket, adjustedPosition.z),
            dataWriter.writeUByte(socket, rotation.yaw),
            dataWriter.writeUByte(socket, rotation.pitch)
        ), false, false)
}

module.exports = {WritePacket}