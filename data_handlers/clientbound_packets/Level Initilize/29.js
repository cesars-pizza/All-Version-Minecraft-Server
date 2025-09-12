const {Socket} = require('../../../data_structures')
const dataWriter = require('../../data_writer')

var packetID = 2
var packetIdentifier = "Level Initilize"

/** 
 * @param {Socket} socket
 */
function WritePacket(socket) {
    socket.writePacket(packetID, packetIdentifier, [])
}

module.exports = {WritePacket}