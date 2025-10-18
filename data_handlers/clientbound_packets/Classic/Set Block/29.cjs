const {Socket, Position} = require('../../../../data_structures.cjs')
const utils = require('../../../../utils/utils.cjs')
const dataWriter = require('../../../data_writer.cjs')

var packetID = 6
var packetIdentifier = "Set Block"

/** 
 * @param {Socket} socket 
 * @param {Position} position 
 * @param {number} blockID 
 */
function WritePacket(socket, position, blockID) {
    if (Math.floor(position.x / 256) == socket.thisPlayer.classicWorldOffset.x && Math.floor(position.z / 256) == socket.thisPlayer.classicWorldOffset.z) {
        socket.writePacket(packetID, packetIdentifier, 
            dataWriter.writeShort(socket, utils.math.NegMod(position.x, 256)).concat(
                dataWriter.writeShort(socket, position.y),
                dataWriter.writeShort(socket, utils.math.NegMod(position.z, 256)),
                dataWriter.writeUByte(socket, blockID)
            ), false, false)
    }
}

module.exports = {WritePacket}