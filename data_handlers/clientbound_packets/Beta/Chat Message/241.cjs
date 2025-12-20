const {Socket, Position} = require('../../../../data_structures.cjs')
const dataWriter = require('../../../data_writer.cjs')
const utils = require('../../../../utils/utils.cjs')

var packetID = 3
var packetIdentifier = "Chat Message"

/** 
 * @param {Socket} socket 
 */
function WritePacket(world, socket, message) {
    socket.writePacket(packetID, packetIdentifier, dataWriter.writeString(socket, message))
}

module.exports = {WritePacket}