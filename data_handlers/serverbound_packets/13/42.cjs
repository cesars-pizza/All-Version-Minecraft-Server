const {Socket} = require('../../../data_structures.cjs')
const dataReader = require('../../data_reader.cjs')
const packetWriter = require('../../clientbound_packets/packet_writer.cjs')
const utils = require('../../../utils/utils.cjs')

var packetID = 13
var packetIdentifier = "Message"

/** 
 * @param {Socket} socket 
 * @param {Buffer} data 
 */
function ReadPacket(world, socket, data) {
    var splitIndex = data.length - 66

    if (splitIndex >= 0) {
        socket.log(`SERVERBOUND --> ${packetID} "${packetIdentifier}" / ${data.length} bytes`, false)

        var id = dataReader.readUByte(socket, data, 0)
        var playerID = dataReader.readByte(socket, data, id.nextPos)
        var message = dataReader.readString(socket, data, playerID.nextPos)

        if (socket.disconnect == "") {
            socket.thisPlayer.messages.push(message.value)
        }
    }
    
    return splitIndex
}

module.exports = {ReadPacket}