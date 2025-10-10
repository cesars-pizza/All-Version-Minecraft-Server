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
        var unknownValue = dataReader.readInt(socket, data, 1)
        var item = dataReader.readShort(socket, data, unknownValue.nextPos)

        if (socket.disconnect == "") {
            
        }

    }
    
    return splitIndex
}

module.exports = {ReadPacket}