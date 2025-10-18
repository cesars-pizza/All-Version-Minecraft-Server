const {Socket, Position} = require('../../../../data_structures.cjs')
const dataWriter = require('../../../data_writer.cjs')
const utils = require('../../../../utils/utils.cjs')

var packetID = 17
var packetIdentifier = "Add To Inventory"

/** 
 * @param {Socket} socket 
 * @param {Position} position 
 */
function WritePacket(world, socket, item, count, life) {
    socket.writePacket(packetID, packetIdentifier, dataWriter.writeShort(socket, item).concat(
        dataWriter.writeByte(socket, count),
        dataWriter.writeShort(socket, life)
    ))
}

module.exports = {WritePacket}