const {Socket, World} = require('../../../data_structures.cjs')
const dataReader = require('../../data_reader.cjs')
const packetWriter = require('../../clientbound_packets/packet_writer.cjs')
const utils = require('../../../utils/utils.cjs')
const { HexViewBytes } = require('../../../server.cjs')

var packetID = 102
var packetIdentifier = "Window Click"

/** 
 * @param {World} world 
 * @param {Socket} socket 
 * @param {Buffer} data 
 */
function ReadPacket(world, socket, data) {
    var splitIndex = data.length - 9

    socket.log(`SERVERBOUND --> ${packetID} "${packetIdentifier}" / ${data.length} bytes`)

    if (splitIndex >= 0) {
        var windowID = dataReader.readByte(socket, data, 1)
        var slot = dataReader.readShort(socket, data, windowID.nextPos)
        var rightClick = dataReader.readByte(socket, data, slot.nextPos)
        var actionNumber = dataReader.readShort(socket, data, rightClick.nextPos)
        var itemID = dataReader.readShort(socket, data, actionNumber.nextPos)

        if (itemID.value != -1) splitIndex -= 2

        if (splitIndex >= 0) {
            var itemCount = {value: 0}
            var itemMeta = {value: 0}
            if (itemID.value != -1) {
                itemCount = dataReader.readByte(socket, data, itemID.nextPos)
                itemMeta = dataReader.readByte(socket, data, itemCount.nextPos)
            }

            console.log(`${windowID.value}, ${slot.value}, ${rightClick.value}, ${actionNumber.value}, ${itemID.value}, ${itemCount.value}, ${itemMeta.value}`)
        }
    }
    
    return splitIndex
}

module.exports = {ReadPacket}