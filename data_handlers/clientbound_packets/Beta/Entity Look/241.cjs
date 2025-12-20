const {Socket, Position, Rotation} = require('../../../../data_structures.cjs')
const utils = require('../../../../utils/utils.cjs')
const dataWriter = require('../../../data_writer.cjs')

var packetID = 32
var packetIdentifier = "Entity Look"

/** 
 * @param {Socket} socket 
 * @param {number} EID
 * @param {Position} Rotation   
 */
function WritePacket(socket, EID, Rotation) {
    socket.writePacket(packetID, packetIdentifier, dataWriter.writeInt(socket, EID).concat(
        dataWriter.writeUByte(socket, Math.round(255 * (utils.math.NegMod(Rotation.yaw, 360) / 360))),
        dataWriter.writeUByte(socket, Math.round(255 * (utils.math.NegMod(Rotation.pitch, 360) / 360)))
    ), false, false)
}

module.exports = {WritePacket}