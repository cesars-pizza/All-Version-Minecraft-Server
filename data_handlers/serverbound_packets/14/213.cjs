const {Socket, World} = require('../../../data_structures.cjs')
const dataReader = require('../../data_reader.cjs')
const packetWriter = require('../../clientbound_packets/packet_writer.cjs')
const utils = require('../../../utils/utils.cjs')

var packetID = 14
var packetIdentifier = "Player Digging"

/** 
 * @param {World} world 
 * @param {Socket} socket 
 * @param {Buffer} data 
 */
function ReadPacket(world, socket, data) {
    var splitIndex = data.length - 12

    if (splitIndex >= 0) {
        var status = dataReader.readByte(socket, data, 1)
        var blockPos = {}
        blockPos.x = dataReader.readInt(socket, data, status.nextPos)
        blockPos.y = dataReader.readByte(socket, data, blockPos.x.nextPos)
        blockPos.z = dataReader.readInt(socket, data, blockPos.y.nextPos)
        var face = dataReader.readByte(socket, data, blockPos.z.nextPos)

        socket.log(`SERVERBOUND --> ${packetID} "${packetIdentifier}" / ${data.length} bytes`)
    }
    
    return splitIndex
}

module.exports = {ReadPacket}