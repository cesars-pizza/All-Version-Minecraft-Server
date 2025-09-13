const {Socket} = require('../../../data_structures.cjs')
const dataWriter = require('../../data_writer.cjs')

var packetID = 2
var packetIdentifier = "Level Initilize"

/** 
 * @param {Socket} socket
 */
function WritePacket(socket) {
    socket.writePacket(packetID, packetIdentifier, [])
}

module.exports = {WritePacket}