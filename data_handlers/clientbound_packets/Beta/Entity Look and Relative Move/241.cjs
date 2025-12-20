const {Socket, Position, Rotation} = require('../../../../data_structures.cjs')
const utils = require('../../../../utils/utils.cjs')
const dataWriter = require('../../../data_writer.cjs')

var packetID = 33
var packetIdentifier = "Entity Look and Relative Move"

/** 
 * @param {Socket} socket 
 * @param {number} EID
 * @param {Position} Position   
 * @param {Position} EstimatedPrevPosition   
 * @param {Rotation} Rotation 
 */
function WritePacket(socket, EID, Position, EstimatedPrevPosition, Rotation) {
    socket.writePacket(packetID, packetIdentifier, dataWriter.writeInt(socket, EID).concat(
        dataWriter.writeByte(socket, Math.round((Position.x - EstimatedPrevPosition.x) * 32)),
        dataWriter.writeByte(socket, Math.round((Position.y - EstimatedPrevPosition.y) * 32)),
        dataWriter.writeByte(socket, Math.round((Position.z - EstimatedPrevPosition.z) * 32)),
        dataWriter.writeUByte(socket, Math.round(255 * (utils.math.NegMod(Rotation.yaw, 360) / 360))),
        dataWriter.writeUByte(socket, Math.round(255 * (utils.math.NegMod(Rotation.pitch, 360) / 360)))
    ), false, false)
}

module.exports = {WritePacket}