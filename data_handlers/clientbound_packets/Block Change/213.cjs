const {Socket, Position} = require('../../../data_structures.cjs')
const dataWriter = require('../../data_writer.cjs')
const utils = require('../../../utils/utils.cjs')

var packetID = 53
var packetIdentifier = "Block Change"

/** 
 * @param {Socket} socket 
 * @param {Position} position 
 */
function WritePacket(world, socket, position, block, blockMeta) {
    socket.writePacket(packetID, packetIdentifier, dataWriter.writeInt(socket, position.x).concat(
        dataWriter.writeByte(socket, position.y),
        dataWriter.writeInt(socket, position.z),
        dataWriter.writeByte(socket, block),
        dataWriter.writeByte(socket, blockMeta)
    ))

    socket.log(`X: ${position.x} => ${dataWriter.writeInt(socket, position.x)}`)
    socket.log(`Y: ${position.y} => ${dataWriter.writeByte(socket, position.y)}`)
    socket.log(`Z: ${position.z} => ${dataWriter.writeInt(socket, position.z)}`)
    socket.log(`Block: ${block}:${blockMeta}`)
}

module.exports = {WritePacket}