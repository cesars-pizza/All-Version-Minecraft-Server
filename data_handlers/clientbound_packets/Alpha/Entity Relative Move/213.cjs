const {Socket, Position, Rotation} = require('../../../../data_structures.cjs')
const utils = require('../../../../utils/utils.cjs')
const dataWriter = require('../../../data_writer.cjs')

var packetID = 31
var packetIdentifier = "Entity Relative Move"

/** 
 * @param {Socket} socket 
 * @param {number} EID
 * @param {Position} Position   
 * @param {Position} EstimatedPrevPosition   
 */
function WritePacket(socket, EID, Position, EstimatedPrevPosition) {
    socket.writePacket(packetID, packetIdentifier, dataWriter.writeInt(socket, EID).concat(
        dataWriter.writeByte(socket, Math.round((Position.x - EstimatedPrevPosition.x) * 32)),
        dataWriter.writeByte(socket, Math.round((Position.y - EstimatedPrevPosition.y) * 32)),
        dataWriter.writeByte(socket, Math.round((Position.z - EstimatedPrevPosition.z) * 32))
    ), false, false)
}

module.exports = {WritePacket}