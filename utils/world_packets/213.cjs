const {Socket} = require('../../data_structures.cjs')
const dataWriter = require('../../data_handlers/data_writer.cjs')
const packetWriter = require('../../data_handlers/clientbound_packets/packet_writer.cjs')
const utils = require('../utils.cjs')

/** 
 * @param {Socket} socket 
 * @param {number[][]} blocks 
 */
function GenerateBlocks(socket, chunkX, chunkZ, blocks, blockMeta, blockLight, skyLight, initilize) {
    packetWriter.Pre_Chunk(socket)(socket, chunkX, chunkZ, initilize)
    if (initilize) {
        var levelData = dataWriter.writeLevelData(socket, blocks, blockMeta, blockLight, skyLight)
        packetWriter.Map_Chunk(socket)(socket, chunkX, chunkZ, levelData)
    }
}

/** 
 * @param {Socket} socket 
 * @param {number[][]} blocks 
 */
function GenerateRenderDistance(world, socket, renderDistance, chunkX, chunkZ, prevChunkX, prevChunkZ) {
    console.log(chunkX)
    console.log(chunkZ)
    if (prevChunkX == undefined || prevChunkZ == undefined) {
        packetWriter.Pre_Chunk(socket)(socket, chunkX, chunkZ, true)
        var unformattedLevelData = utils.worldgen.GenerateBlocks(socket)(world, socket, chunkX, chunkZ)
        var levelData = dataWriter.writeLevelData(socket, unformattedLevelData)
        packetWriter.Block_Change(socket)(world, socket, {x: chunkX * 16 + 1, y: 0, z: chunkZ * 16 + 1}, 4, 0)
        packetWriter.Map_Chunk(socket)(socket, chunkX, chunkZ, levelData)
                
        for (var x = chunkX - renderDistance; x <= chunkX + renderDistance; x++) {
            for (var z = chunkZ - renderDistance; z <= chunkZ + renderDistance; z++) {
                if (x != chunkX || z != chunkZ) {
                    packetWriter.Pre_Chunk(socket)(socket, x, z, true)
                    //packetWriter.Block_Change(socket)(world, socket, {x: x * 16 + 1, y: 0, z: z * 16 + 1}, 4, 0)
                }
            }
        }
        
        packetWriter.Player_Position_And_Rotation(socket)(world, socket, socket.thisPlayer.position, socket.thisPlayer.rotation, true)
        
        for (var x = chunkX - renderDistance; x <= chunkX + renderDistance; x++) {
            for (var z = chunkZ - renderDistance; z <= chunkZ + renderDistance; z++) {
                if (x != chunkX || z != chunkZ) {
                    var unformattedLevelData = utils.worldgen.GenerateBlocks(socket)(world, socket, x, z)
                    var levelData = dataWriter.writeLevelData(socket, unformattedLevelData)
                    packetWriter.Map_Chunk(socket)(socket, x, z, levelData)
                }
            }
        }
    } else {
        for (var x = prevChunkX - renderDistance; x <= prevChunkX + renderDistance; x++) {
            var distanceX = Math.abs(x - chunkX)
            for (var z = prevChunkZ - renderDistance; z <= prevChunkZ + renderDistance; z++) {
                var distanceZ = Math.abs(z - chunkZ)

                if (distanceX > renderDistance || distanceZ > renderDistance) packetWriter.Pre_Chunk(socket)(socket, x, z, false)
            }
        }

        for (var x = chunkX - renderDistance; x <= chunkX + renderDistance; x++) {
            var distanceX = Math.abs(x - prevChunkX)
            for (var z = chunkZ - renderDistance; z <= chunkZ + renderDistance; z++) {
                var distanceZ = Math.abs(z - prevChunkZ)

                if (distanceX > renderDistance || distanceZ > renderDistance) {
                    packetWriter.Pre_Chunk(socket)(socket, x, z, true)
                }
            }
        }

        for (var x = chunkX - renderDistance; x <= chunkX + renderDistance; x++) {
            var distanceX = Math.abs(x - prevChunkX)
            for (var z = chunkZ - renderDistance; z <= chunkZ + renderDistance; z++) {
                var distanceZ = Math.abs(z - prevChunkZ)

                if (distanceX > renderDistance || distanceZ > renderDistance) {
                    var unformattedLevelData = utils.worldgen.GenerateBlocks(socket)(world, socket, x, z)
                    var levelData = dataWriter.writeLevelData(socket, unformattedLevelData.blocks, unformattedLevelData.blockMeta, unformattedLevelData.blockLight, unformattedLevelData.skyLight)
                    packetWriter.Map_Chunk(socket)(socket, x, z, levelData)
                }
            }
        }
    }
}

module.exports = {GenerateBlocks, GenerateRenderDistance}