const {Socket, World} = require('../../../data_structures.cjs')
const dataReader = require('../../data_reader.cjs')
const packetWriter = require('../../clientbound_packets/packet_writer.cjs')
const utils = require('../../../utils/utils.cjs')
const { HexViewBytes } = require('../../../server.cjs')

var packetID = 21
var packetIdentifier = "Pickup Spawn"

/** 
 * @param {World} world 
 * @param {Socket} socket 
 * @param {Buffer} data 
 */
function ReadPacket(world, socket, data) {
    var splitIndex = data.length - 23
    
    socket.log(`SERVERBOUND --> ${packetID} "${packetIdentifier}" / ${data.length} bytes`)

    if (splitIndex >= 0) {

        var itemID = dataReader.readShort(socket, data, 5)
        var itemCount = dataReader.readByte(socket, data, itemID.nextPos)

        if (socket.disconnect == "") {
            packetWriter.Add_To_Inventory(socket)(world, socket, itemID.value, itemCount.value, 0)
        }

    }
    
    return splitIndex
}

module.exports = {ReadPacket}