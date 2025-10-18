const {Socket} = require('../../../../data_structures.cjs')
const dataWriter = require('../../../data_writer.cjs')

var packetID = 13
var packetIdentifier = "Message"

/** 
 * @param {Socket} socket 
 * @param {string} message 
 */
function WritePacket(socket, playerID, message) {
    socket.writePacket(packetID, packetIdentifier, dataWriter.writeByte(socket, playerID).concat(dataWriter.writeString(socket, message)))
}

module.exports = {WritePacket}