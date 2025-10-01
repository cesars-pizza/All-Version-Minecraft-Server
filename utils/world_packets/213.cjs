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
    if (prevChunkX == undefined || prevChunkZ == undefined) {
        
        for (var x = chunkX - renderDistance; x <= chunkX + renderDistance; x++) {
            for (var z = chunkZ - renderDistance; z <= chunkZ + renderDistance; z++) {
                packetWriter.Pre_Chunk(socket)(socket, x, z, true)
            }
        }

        packetWriter.Player_Position_And_Look(socket)(world, socket, socket.thisPlayer.position, socket.thisPlayer.position.y + 1.6, socket.thisPlayer.rotation, true)
        var positionInterval = setInterval((world, socket) => {
            packetWriter.Player_Position_And_Look(socket)(world, socket, socket.thisPlayer.position, socket.thisPlayer.position.y + 1.6, socket.thisPlayer.rotation, true)
        }, 50, world, socket)
        
        for (var x = chunkX - renderDistance; x <= chunkX + renderDistance; x+=16) {
            for (var z = chunkZ - renderDistance; z <= chunkZ + renderDistance; z+=16) {
                var unformattedLevelDatas = []
                var loadPlayer = false
                for (var innerX = 0; innerX < 16 && x + innerX <= chunkX + renderDistance; innerX++) {
                    unformattedLevelDatas[innerX] = []
                    for (var innerZ = 0; innerZ < 16 && z + innerZ <= chunkZ + renderDistance; innerZ++) {
                        if (x + innerX == chunkX && z + innerZ == chunkZ) loadPlayer = true
                        unformattedLevelDatas[innerX][innerZ] = utils.worldgen.GenerateBlocks(socket)(world, socket, x + innerX, z + innerZ)
                    }
                }
                var levelData = dataWriter.writeLevelData(socket, unformattedLevelDatas)
                packetWriter.Map_Chunk(socket)(socket, x, z, unformattedLevelDatas.length, unformattedLevelDatas[0].length, levelData)
            }
        }

        setTimeout((value, socket) => {clearInterval(value); socket.thisPlayer.allowMovement = true}, 1000, positionInterval, socket)
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