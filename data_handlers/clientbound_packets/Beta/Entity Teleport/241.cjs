const {Socket, Position, Rotation} = require('../../../../data_structures.cjs')
const utils = require('../../../../utils/utils.cjs')
const dataWriter = require('../../../data_writer.cjs')

var packetID = 34
var packetIdentifier = "Entity Teleport"

/** 
 * @param {Socket} socket 
 * @param {number} EID
 * @param {string} PlayerName
 * @param {Position} Position   
 * @param {Rotation} Rotation 
 * @param {number} heldItem 
 */
function WritePacket(socket, EID, Position, Rotation) {
    socket.writePacket(packetID, packetIdentifier, dataWriter.writeInt(socket, EID).concat(
        dataWriter.writeInt(socket, Position.x * 32),
        dataWriter.writeInt(socket, Position.y * 32),
        dataWriter.writeInt(socket, Position.z * 32),
        dataWriter.writeUByte(socket, Math.round(255 * (utils.math.NegMod(Rotation.yaw, 360) / 360))),
        dataWriter.writeUByte(socket, Math.round(255 * (utils.math.NegMod(Rotation.pitch, 360) / 360)))
    ))
}

module.exports = {WritePacket}