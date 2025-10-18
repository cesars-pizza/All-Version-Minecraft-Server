const {Socket} = require('../../../../data_structures.cjs')
const dataWriter = require('../../../data_writer.cjs')

var packetID = 255
var packetIdentifier = "Kick"

/** 
 * @param {Socket} socket 
 */
function WritePacket(socket, reason) {
    socket.writePacket(packetID, packetIdentifier, dataWriter.writeString(socket, reason))
}

module.exports = {WritePacket}