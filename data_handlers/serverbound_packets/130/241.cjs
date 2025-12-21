const {Socket, World} = require('../../../data_structures.cjs')
const dataReader = require('../../data_reader.cjs')
const packetWriter = require('../../clientbound_packets/packet_writer.cjs')
const utils = require('../../../utils/utils.cjs')
const { HexViewBytes } = require('../../../server.cjs')
const fs = require('fs')
const dataWriter = require('../../data_writer.cjs')

var packetID = 130
var packetIdentifier = "Update Sign"

/** 
 * @param {World} world 
 * @param {Socket} socket 
 * @param {Buffer} data 
 */
function ReadPacket(world, socket, data) {    
    socket.log(`SERVERBOUND --> ${packetID} "${packetIdentifier}" / ${data.length} bytes`)

    var universalSignData = utils.blockEntity.ConvertToUniversalData(world, socket, "oak_sign", {}, data.subarray(1))

    if (data.length - (universalSignData.nextPos + 1) >= 0) {
        var blockPos = universalSignData.data.position

        if (utils.math.NegMod(blockPos.x, 32) >= 16 && utils.math.NegMod(blockPos.z, 32) >= 16) {
            var hitBuildIndex = utils.builds.GetBuild(socket)(world, Math.floor(blockPos.x / 32), Math.floor(blockPos.z / 32))
        
            if (hitBuildIndex != undefined && world.builds[hitBuildIndex].creator == socket.thisPlayer.username) {
                utils.tick_actions.set_block.AddBlockEntityUpdate(socket)(world, socket, "oak_sign", blockPos, universalSignData.data, false)
            } else {
                var actualBlockEntity = utils.worldgen.GetBlockEntity(socket)(world, socket, blockPos)
                if (actualBlockEntity != undefined && actualBlockEntity.id != undefined) {
                    packetWriter.Beta.Update_Sign(socket)(world, socket, blockPos, actualBlockEntity)
                }
            }
        }
    }
    
    return data.length - (universalSignData.nextPos + 1)
}

module.exports = {ReadPacket}