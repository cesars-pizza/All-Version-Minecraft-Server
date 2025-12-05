const {Socket} = require('../../../../data_structures.cjs')
const dataWriter = require('../../../data_writer.cjs')

var packetID = 4
var packetIdentifier = "Time Update"

/** 
 * @param {Socket} socket 
 */
function WritePacket(socket, time) {
    socket.writePacket(packetID, packetIdentifier, dataWriter.writeLong(socket, time), false, false)
}

module.exports = {WritePacket}