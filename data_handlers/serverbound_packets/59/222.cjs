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
    
    socket.log(`SERVERBOUND --> ${packetID} "${packetIdentifier}" / ${data.length} bytes`)

    var positionX = dataReader.readInt(socket, data, 1)
    var positionY = dataReader.readShort(socket, data, positionX.nextPos)
    var positionZ = dataReader.readInt(socket, data, positionY.nextPos)
    var payloadLength = dataReader.readShort(socket, data, positionZ.nextPos)

    var splitIndex = data.length - (payloadLength.nextPos + payloadLength.value)

    if (splitIndex >= 0) {
        var rawData = dataReader.readNBT(socket, dataReader.readGZip(socket, data.subarray(payloadLength.nextPos, payloadLength.nextPos + payloadLength.value), 0), 0).value
        
        var blockPos = {
            x: rawData.x.value,
            y: rawData.y.value,
            z: rawData.z.value
        }
        
        var blockID = rawData.id.value
        if (blockID == "Chest") blockID = "chest"
        else if (blockID == "Furnace") blockID = "furnace"
        else if (blockID == "Sign") blockID = "oak_sign"
        else if (blockID == "MobSpawner") blockID = "spawner"

        var universalData = utils.blockEntity.ConvertToUniversalData(world, socket, blockID, blockPos, rawData)

        if (utils.math.NegMod(blockPos.x, 32) >= 16 && utils.math.NegMod(blockPos.z, 32) >= 16) {
            var hitBuildIndex = utils.builds.GetBuild(socket)(world, Math.floor(blockPos.x / 32), Math.floor(blockPos.z / 32))
        
            if (hitBuildIndex != undefined && world.builds[hitBuildIndex].creator == socket.thisPlayer.username) {
                utils.tick_actions.set_block.AddBlockEntityUpdate(socket)(world, socket, blockID, blockPos, universalData, false)
            }
        }
    }
    
    return splitIndex
}

module.exports = {ReadPacket}