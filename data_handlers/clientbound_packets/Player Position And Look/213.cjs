const {Socket, Position, Rotation} = require('../../../data_structures.cjs')
const dataWriter = require('../../data_writer.cjs')
const utils = require('../../../utils/utils.cjs')

var packetID = 13
var packetIdentifier = "Player Position And Look"

/** 
 * @param {Socket} socket
 * @param {Position} position 
 * @param {Rotation} rotation 
 */
function WritePacket(world, socket, position, rotation, onGround) {
    socket.writePacket(packetID, packetIdentifier, dataWriter.writeDouble(socket, position.x).concat(
        dataWriter.writeDouble(socket, position.y + 1.62),
        dataWriter.writeDouble(socket, position.y),
        dataWriter.writeDouble(socket, position.z),
        dataWriter.writeFloat(socket, rotation.yaw),
        dataWriter.writeFloat(socket, rotation.pitch),
        dataWriter.writeBool(socket, onGround)
    ))
}

module.exports = {WritePacket}