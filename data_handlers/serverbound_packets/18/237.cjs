const {Socket, World} = require('../../../data_structures.cjs')
const dataReader = require('../../data_reader.cjs')
const packetWriter = require('../../clientbound_packets/packet_writer.cjs')
const utils = require('../../../utils/utils.cjs')

var packetID = 18
var packetIdentifier = "Arm Animation"

/** 
 * @param {World} world 
 * @param {Socket} socket 
 * @param {Buffer} data 
 */
function ReadPacket(world, socket, data) {
    var splitIndex = data.length - 6

    var Entity = dataReader.readInt(socket, data, 1)
    var Animation = dataReader.readByte(socket, data, Entity.nextPos)

    socket.log(`SERVERBOUND --> ${packetID} "${packetIdentifier}" / ${data.length} bytes`)
    
    if (splitIndex >= 0) {
        if (Animation.value == 104) utils.player.set.Sneaking(world, socket.thisPlayer, true)
        else if (Animation.value == 105) utils.player.set.Sneaking(world, socket.thisPlayer, false)
    }
    
    return splitIndex
}

module.exports = {ReadPacket}