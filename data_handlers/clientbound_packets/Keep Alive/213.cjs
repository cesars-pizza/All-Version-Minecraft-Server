const {Socket} = require('../../../data_structures.cjs')
const dataWriter = require('../../data_writer.cjs')
const utils = require('../../../utils/utils.cjs')

var packetID = 0
var packetIdentifier = "Keep Alive"

/** 
 * @param {Socket} socket 
 */
function WritePacket(world, socket) {
    socket.writePacket(packetID, packetIdentifier, [])
}

module.exports = {WritePacket}