const {Socket, World} = require('../../../data_structures.cjs')
const dataReader = require('../../data_reader.cjs')
const packetWriter = require('../../clientbound_packets/packet_writer.cjs')
const utils = require('../../../utils/utils.cjs')
const { HexViewBytes } = require('../../../server.cjs')
const fs = require('fs')
const dataWriter = require('../../data_writer.cjs')

var packetID = 59
var packetIdentifier = "Complex Entities"

/** 
 * @param {World} world 
 * @param {Socket} socket 
 * @param {Buffer} data 
 */
function ReadPacket(world, socket, data) {
    if (data.length < 13) return -999
    
    socket.log(`SERVERBOUND --> ${packetID} "${packetIdentifier}" / ${data.length} bytes`, false)

    var positionX = dataReader.readInt(socket, data, 1)
    var positionY = dataReader.readShort(socket, data, positionX.nextPos)
    var positionZ = dataReader.readInt(socket, data, positionY.nextPos)
    var payloadLength = dataReader.readShort(socket, data, positionZ.nextPos)

    var splitIndex = data.length - (payloadLength.nextPos + payloadLength.value)

    if (splitIndex >= 0) {
        fs.writeFileSync("./debug/tileEntityRaw.bin", Buffer.from(dataReader.readGZip(socket, data.subarray(payloadLength.nextPos, payloadLength.nextPos + payloadLength.value), 0)))
        fs.writeFileSync("./debug/tileEntityData.json", JSON.stringify(dataReader.readNBT(socket, dataReader.readGZip(socket, data.subarray(payloadLength.nextPos, payloadLength.nextPos + payloadLength.value), 0), 0).value, undefined, 4))
    }
    
    return splitIndex
}

module.exports = {ReadPacket}