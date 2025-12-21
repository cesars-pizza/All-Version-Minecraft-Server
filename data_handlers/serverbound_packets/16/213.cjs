const {Socket, World} = require('../../../data_structures.cjs')
const dataReader = require('../../data_reader.cjs')
const packetWriter = require('../../clientbound_packets/packet_writer.cjs')
const utils = require('../../../utils/utils.cjs')
const { HexViewBytes } = require('../../../server.cjs')

var packetID = 16
var packetIdentifier = "Holding Change"

/** 
 * @param {World} world 
 * @param {Socket} socket 
 * @param {Buffer} data 
 */
function ReadPacket(world, socket, data) {
    var splitIndex = data.length - 7

    socket.log(`SERVERBOUND --> ${packetID} "${packetIdentifier}" / ${data.length} bytes`)

    if (splitIndex >= 0) {
        var slot = dataReader.readShort(socket, data, 1)

        if (socket.disconnect == "") {
            socket.thisPlayer.inventory.held_item = socket.thisPlayer.inventory.slots.hotbar[slot.value]
            socket.thisPlayer.tick.heldItem = true
        }

    }
    
    return splitIndex
}

module.exports = {ReadPacket}