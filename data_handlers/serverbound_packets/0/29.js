const {Socket} = require('../../../data_structures')
const dataReader = require('../../data_reader')
const packetWriter = require('../../clientbound_packets/packet_writer')

var packetID = 0
var packetIdentifier = "Player Identification"

/** 
 * @param {Socket} socket 
 * @param {Buffer} data 
 */
function ReadPacket(socket, data) {
    var splitIndex = data.length - 65

    if (splitIndex >= 0) {
        var ID = dataReader.readUByte(socket, data, 0)
        var Username = dataReader.readString(socket, data, ID.nextPos)

        socket.log(`SERVERBOUND --> ${packetID} "${packetIdentifier}" / ${data.length} bytes`, false)
        socket.log(`Packet ID: ${ID.value}`)
        socket.log(`Username: ${Username.value}`)

        packetWriter.Server_Identification(socket)(socket, "Cool Server", "Welcome to Localhost:25565", 0x00)
    }

    return splitIndex
}

module.exports = {ReadPacket}