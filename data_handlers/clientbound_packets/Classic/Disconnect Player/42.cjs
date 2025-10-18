const {Socket} = require('../../../../data_structures.cjs')
const dataWriter = require('../../../data_writer.cjs')

var packetID = 14
var packetIdentifier = "Disconnect Player"

/** 
 * @param {Socket} socket
 */
function WritePacket(socket, reason) {
    socket.writePacket(packetID, packetIdentifier, dataWriter.writeString(socket, reason))
}

module.exports = {WritePacket}