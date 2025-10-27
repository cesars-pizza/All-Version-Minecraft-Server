const {Socket, Position, Rotation} = require('../../../../data_structures.cjs')
const utils = require('../../../../utils/utils.cjs')
const dataWriter = require('../../../data_writer.cjs')

var packetID = 20
var packetIdentifier = "Named Entity Spawn"

/** 
 * @param {Socket} socket 
 * @param {number} EID
 * @param {string} PlayerName
 * @param {Position} Position   
 * @param {Rotation} Rotation 
 * @param {number} heldItem 
 */
function WritePacket(socket, EID, PlayerName, Position, Rotation, heldItem) {
    socket.writePacket(packetID, packetIdentifier, dataWriter.writeInt(socket, EID).concat(
        dataWriter.writeString(socket, PlayerName),
        dataWriter.writeInt(socket, Position.x * 32),
        dataWriter.writeInt(socket, Position.y * 32),
        dataWriter.writeInt(socket, Position.z * 32),
        dataWriter.writeUByte(socket, Math.round(255 * (utils.math.NegMod(Rotation.yaw, 360) / 360))),
        dataWriter.writeUByte(socket, Math.round(255 * (utils.math.NegMod(Rotation.pitch, 360) / 360))),
        dataWriter.writeShort(socket, heldItem)
    ), false, false)
}

module.exports = {WritePacket}