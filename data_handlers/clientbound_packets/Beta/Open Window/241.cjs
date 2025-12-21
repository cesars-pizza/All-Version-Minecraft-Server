const {Socket} = require('../../../../data_structures.cjs')
const dataWriter = require('../../../data_writer.cjs')

var packetID = 100
var packetIdentifier = "Open Window"

/** 
 * @param {Socket} socket 
 */
function WritePacket(socket, windowID, windowType, windowTitle, slotCount) {
    socket.writePacket(packetID, packetIdentifier, [].concat(
        dataWriter.writeByte(socket, windowID),
        dataWriter.writeByte(socket, windowType),
        dataWriter.writeString(socket, windowTitle),
        dataWriter.writeByte(socket, slotCount),
    ), false, false)
}

module.exports = {WritePacket}