const {Socket, Position} = require('../../../../data_structures.cjs')
const dataWriter = require('../../../data_writer.cjs')
const utils = require('../../../../utils/utils.cjs')

var packetID = 52
var packetIdentifier = "Multi Block Change"

/** 
 * @param {Socket} socket 
 * @param {Position} position 
 */
function WritePacket(world, socket, position, block, blockMeta) {
    socket.writePacket(packetID, packetIdentifier,
        dataWriter.writeInt(socket, Math.floor(position.x / 16)).concat(
        dataWriter.writeInt(socket, Math.floor(position.z / 16)),
        dataWriter.writeShort(socket, 1),
        dataWriter.writeShort(socket, utils.math.NegMod(position.x, 16) * 4096 + utils.math.NegMod(position.z, 16) * 256 + (position.y & 0xff)),
        dataWriter.writeByte(socket, block),
        dataWriter.writeByte(socket, blockMeta)
    ))
}

module.exports = {WritePacket}