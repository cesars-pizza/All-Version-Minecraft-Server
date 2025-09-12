const {Socket} = require('../../../data_structures')
const dataWriter = require('../../data_writer')

var packetID = 0
var packetIdentifier = "Server Identification"

/** 
 * @param {Socket} socket 
 * @param {string} serverName 
 */
function WritePacket(socket, serverName) {
    socket.writePacket(packetID, packetIdentifier, dataWriter.writeString(socket, serverName))
}

module.exports = {WritePacket}