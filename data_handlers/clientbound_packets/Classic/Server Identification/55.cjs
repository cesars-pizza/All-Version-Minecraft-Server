const {Socket} = require('../../../../data_structures.cjs')
const dataWriter = require('../../../data_writer.cjs')
const utils = require('../../../../utils/utils.cjs')

var packetID = 0
var packetIdentifier = "Server Identification"

/** 
 * @param {Socket} socket 
 * @param {string} serverName 
 */
function WritePacket(world, socket, serverName, serverStatus, playerOpped) {
    socket.writePacket(packetID, packetIdentifier, dataWriter.writeUByte(socket, utils.registry.version.GetVersion(world, socket.thisPlayer.uvni).pvn).concat(
        dataWriter.writeString(socket, serverName),
        dataWriter.writeString(socket, serverStatus),
        dataWriter.writeUByte(socket, playerOpped ? 100 : 0)
    ))
}

module.exports = {WritePacket}