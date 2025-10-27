const {Socket} = require('../../../../data_structures.cjs')
const dataWriter = require('../../../data_writer.cjs')

var packetID = 30
var packetIdentifier = "Entity"

/** 
 * @param {Socket} socket 
 */
function WritePacket(socket, EID) {
    socket.writePacket(packetID, packetIdentifier, dataWriter.writeInt(socket, EID), false, false)
}

module.exports = {WritePacket}