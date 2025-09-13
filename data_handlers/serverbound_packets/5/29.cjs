const {Socket} = require('../../../data_structures')
const dataReader = require('../../data_reader')
const packetWriter = require('../../clientbound_packets/packet_writer')
const utils = require('../../../utils/utils')

var packetID = 5
var packetIdentifier = "Set Block"

/** 
 * @param {Socket} socket 
 * @param {Buffer} data 
 */
function ReadPacket(world, socket, data) {
    var splitIndex = data.length - 9

    if (splitIndex >= 0) {
        socket.log(`SERVERBOUND --> ${packetID} "${packetIdentifier}" / ${data.length} bytes`)

        var id = dataReader.readUByte(socket, data, 0)
        var posX = dataReader.readShort(socket, data, id.nextPos)
        var posY = dataReader.readShort(socket, data, posX.nextPos)
        var posZ = dataReader.readShort(socket, data, posY.nextPos)
        var mode = dataReader.readUByte(socket, data, posZ.nextPos)
        var blockID = dataReader.readUByte(socket, data, mode.nextPos)

        if (socket.disconnect == "") {
            if (mode.value == 1) {
                packetWriter.Set_Block(socket)(socket, {x: posX.value, y: posY.value, z: posZ.value}, blockID.value)
            } else {
                if (posY.value > 0) {
                    packetWriter.Set_Block(socket)(socket, {x: posX.value, y: posY.value, z: posZ.value}, 0)
                }
            }
        }

    }
    
    return splitIndex
}

module.exports = {ReadPacket}