const {Socket, Position} = require('../../../../data_structures.cjs')
const dataWriter = require('../../../data_writer.cjs')
const utils = require('../../../../utils/utils.cjs')

var packetID = 2
var packetIdentifier = "Handshake"

/** 
 * @param {Socket} socket 
 */
function WritePacket(world, socket, hash) {
    socket.writePacket(packetID, packetIdentifier, dataWriter.writeString(socket, hash))
}

module.exports = {WritePacket}