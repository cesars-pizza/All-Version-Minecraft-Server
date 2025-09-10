const {Socket} = require('../../../data_structures')
const dataWriter = require('../../data_writer')

var packetID = 0
var packetIdentifier = "Server Identification"

/** 
 * @param {Socket} socket 
 * @param {string} serverMessage 
 * @param {string} serverName 
 * @param {boolean} playerOperator 
 */
function WritePacket(socket, serverName, serverMessage, playerOperator) {
    socket.writePacket(packetID, packetIdentifier, 
        dataWriter.writeString(socket, serverName).concat(
            dataWriter.writeString(socket, serverMessage),
            dataWriter.writeUByte(socket, playerOperator ? 64 : 0)
        ))
}

module.exports = {WritePacket}