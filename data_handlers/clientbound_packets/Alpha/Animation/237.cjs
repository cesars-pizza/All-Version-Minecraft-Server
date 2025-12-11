const {Socket} = require('../../../../data_structures.cjs')
const dataWriter = require('../../../data_writer.cjs')

var packetID = 18
var packetIdentifier = "Animation"

/** 
 * @param {Socket} socket 
 */
function WritePacket(socket, EID, animation) {
    socket.writePacket(packetID, packetIdentifier, dataWriter.writeInt(socket, EID).concat(
        dataWriter.writeByte(socket, animation)
    ), false, false)
}

module.exports = {WritePacket}