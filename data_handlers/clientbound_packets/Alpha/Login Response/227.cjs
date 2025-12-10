const {Socket} = require('../../../../data_structures.cjs')
const dataWriter = require('../../../data_writer.cjs')
const utils = require('../../../../utils/utils.cjs')

var packetID = 1
var packetIdentifier = "Login Response"

/** 
 * @param {Socket} socket 
 * @param {string} serverName 
 */
function WritePacket(world, socket, playerID, serverName, serverStatus, seed, dimension) {
    socket.writePacket(packetID, packetIdentifier, dataWriter.writeInt(socket, playerID).concat(
        dataWriter.writeString(socket, serverName),
        dataWriter.writeString(socket, serverStatus),
        dataWriter.writeLong(socket, 0),
        dataWriter.writeByte(socket, 0)
    ))
}

module.exports = {WritePacket}