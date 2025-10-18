const {Socket} = require('../../../../data_structures.cjs')
const dataWriter = require('../../../data_writer.cjs')

var packetID = 0
var packetIdentifier = "Server Identification"

/** 
 * @param {Socket} socket 
 * @param {string} serverName 
 */
function WritePacket(world, socket, serverName) {
    socket.writePacket(packetID, packetIdentifier, dataWriter.writeString(socket, serverName))
}

module.exports = {WritePacket}