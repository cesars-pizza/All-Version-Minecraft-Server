const {Socket} = require('../../../data_structures.cjs')
const dataWriter = require('../../data_writer.cjs')

var packetID = 4
var packetIdentifier = "Level Finalize"

/** 
 * @param {Socket} socket 
 * @param {number} sizeX 
 * @param {number} sizeY 
 * @param {number} sizeZ 
 */
function WritePacket(socket, sizeX, sizeY, sizeZ) {
    socket.writePacket(packetID, packetIdentifier, 
        dataWriter.writeShort(socket, sizeX).concat(
            dataWriter.writeShort(socket, sizeY),
            dataWriter.writeShort(socket, sizeZ)
        ))
}

module.exports = {WritePacket}