const {Socket, Position} = require('../../../data_structures')
const dataWriter = require('../../data_writer')

var packetID = 6
var packetIdentifier = "Set Block"

/** 
 * @param {Socket} socket 
 * @param {Position} position 
 * @param {number} blockID 
 */
function WritePacket(socket, position, blockID) {
    socket.writePacket(packetID, packetIdentifier, 
        dataWriter.writeShort(socket, position.x).concat(
            dataWriter.writeShort(socket, position.y),
            dataWriter.writeShort(socket, position.z),
            dataWriter.writeUByte(socket, blockID)
        ))
}

module.exports = {WritePacket}