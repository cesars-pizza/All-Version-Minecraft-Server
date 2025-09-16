const {Socket} = require('../../../data_structures.cjs')
const dataWriter = require('../../data_writer.cjs')

var packetID = 12
var packetIdentifier = "Despawn Player"

/** 
 * @param {Socket} socket
 */
function WritePacket(socket, playerID) {
    socket.writePacket(packetID, packetIdentifier, dataWriter.writeByte(socket, playerID))
}

module.exports = {WritePacket}