const {Socket} = require('../../../../data_structures.cjs')
const utils = require('../../../../utils/utils.cjs')
const dataWriter = require('../../../data_writer.cjs')

var packetID = 7
var packetIdentifier = "Spawn Player"

/** 
 * @param {Socket} socket
 */
function WritePacket(socket, playerID, playerName, position, rotation) {
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

    socket.writePacket(packetID, packetIdentifier, dataWriter.writeByte(socket, playerID).concat(
        dataWriter.writeString(socket, playerName),
        dataWriter.writeFixed5Short(socket, adjustedPosition.x),
        dataWriter.writeFixed5Short(socket, adjustedPosition.y + 1.59375),
        dataWriter.writeFixed5Short(socket, adjustedPosition.z),
        dataWriter.writeUByte(socket, rotation.yaw),
        dataWriter.writeUByte(socket, rotation.pitch)))
}

module.exports = {WritePacket}