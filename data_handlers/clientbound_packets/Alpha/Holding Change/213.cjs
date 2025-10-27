const {Socket} = require('../../../../data_structures.cjs')
const dataWriter = require('../../../data_writer.cjs')

var packetID = 16
var packetIdentifier = "Holding Change"

/** 
 * @param {Socket} socket 
 */
function WritePacket(socket, EID, item) {
    socket.writePacket(packetID, packetIdentifier, dataWriter.writeInt(socket, EID).concat(
        dataWriter.writeShort(socket, item)
    ), false, false)
}

module.exports = {WritePacket}