const {Socket, World, Position} = require('../../data_structures.cjs')
const dataWriter = require('../../data_handlers/data_writer.cjs')
const packetWriter = require('../../data_handlers/clientbound_packets/packet_writer.cjs')
const utils = require('../utils.cjs')

/**
 * @param {World} world 
 * @param {Socket} socket 
 * @param {number} chunkX 
 * @param {number} chunkZ 
 */
function GenerateBlocks(world, socket, chunkX, chunkZ) {
    var airID = utils.registry.block.GetBlockID(world, socket.thisPlayer.selectedRegistries.block, "air")
    var cobblestoneID = utils.registry.block.GetBlockID(world, socket.thisPlayer.selectedRegistries.block, "cobblestone")
    var grassID = utils.registry.block.GetBlockID(world, socket.thisPlayer.selectedRegistries.block, "grass_block")
    var logID = utils.registry.block.GetBlockID(world, socket.thisPlayer.selectedRegistries.block, "oak_log")
    var northStairID = utils.registry.block.GetBlockID(world, socket.thisPlayer.selectedRegistries.block, "stone")
    var eastStairID = utils.registry.block.GetBlockID(world, socket.thisPlayer.selectedRegistries.block, "stone")
    var southStairID = utils.registry.block.GetBlockID(world, socket.thisPlayer.selectedRegistries.block, "stone")
    var westStairID = utils.registry.block.GetBlockID(world, socket.thisPlayer.selectedRegistries.block, "stone")

    var blocks = [[], []]
    
    var chunkTypeX = utils.math.NegMod(chunkX, 2)
    var chunkTypeZ = utils.math.NegMod(chunkZ, 2)
    for (var z = 0; z < 16; z++) {
        blocks[0][z] = []
        blocks[1][z] = []
        for (var x = 0; x < 16; x++) {
            blocks[0][z][x] = cobblestoneID

            if (chunkTypeX == 1 && chunkTypeZ == 1) {
                var buildIndex = utils.builds.GetBuild(socket)(world, Math.floor(chunkX / 2), Math.floor(chunkZ / 2))
                if (buildIndex == undefined) blocks[1][z][x] = grassID
                else {
                    blocks[1][z][x] = utils.registry.block.GetBlockID(world, socket.thisPlayer.selectedRegistries.block, world.builds[buildIndex].floor)
                }
            }
            else blocks[1][z][x] = airID
        }
    }
    if (chunkTypeX == 0 || chunkTypeZ == 0) {
        blocks[1][0][0] = logID
        blocks[1][15][0] = logID
        blocks[1][0][15] = logID
        blocks[1][15][15] = logID

        if (chunkTypeX == 1) {
            for (var x = 1; x < 15; x++) {
                blocks[1][0][x]= northStairID
                blocks[1][15][x] = southStairID
            }
        } else if (chunkTypeZ == 1) {
            for (var z = 1; z < 15; z++) {
                blocks[1][z][0] = westStairID
                blocks[1][z][15] = eastStairID
            }
        }
    }

    var hasBuild = -1
    if (chunkTypeX == 1 && chunkTypeZ == 1) {
        var buildIndex = utils.builds.GetBuild(socket)(world, Math.floor(chunkX / 2), Math.floor(chunkZ / 2))
        if (buildIndex != undefined) hasBuild = buildIndex
    }
    if (hasBuild >= 0) {
        for (var y = 2; y < 128; y++) {
            blocks[y] = []
            for (var z = 0; z < 16; z++) {
                blocks[y][z] = []
                for (var x = 0; x < 16; x++) {
                    if (y < 64) blocks[y][z][x] = utils.registry.block.GetBlockID(world, socket.thisPlayer.selectedRegistries.block, world.builds[buildIndex].blocks[y - 2][z][x])
                    else blocks[y][z][x] = airID
                }
            }
        }
    } else {
        for (var y = 2; y < 128; y++) {
            blocks[y] = []
            for (var z = 0; z < 16; z++) {
                blocks[y][z] = []
                for (var x = 0; x < 16; x++) {
                    blocks[y][z][x] = airID
                }
            }
        }
    }

    var blockMetadata = []
    var blockLight = []
    var skyLight = []
    for (var y = 0; y < 128; y++) {
        blockMetadata[y] = []
        blockLight[y] = []
        skyLight[y] = []

        for (var z = 0; z < 16; z++) {
            blockMetadata[y][z] = []
            blockLight[y][z] = []
            skyLight[y][z] = []

            for (var x = 0; x < 16; x++) {
                blockMetadata[y][z][x] = 0
                blockLight[y][z][x] = 15
                skyLight[y][z][x] = 15
            }
        }
    }

    return {
        blocks: blocks,
        blockMeta: blockMetadata,
        blockLight: blockLight,
        skyLight: skyLight
    }
}

/**
 * @param {World} world 
 * @param {Position} blockPos 
 */
function GetBlock(world, socket, blockPos) {
    if (blockPos.y == 0) return "cobblestone"
    else if (blockPos.y == 1) {
        if ((blockPos.x % 32) > 15 && (blockPos.z % 32) > 15) {
            var build = utils.builds.GetBuild(socket)(world, Math.floor(blockPos.x / 32), Math.floor(blockPos.z / 32))

            if (build == undefined) return "grass_block"
            else return world.builds[build].floor
        } else {
            if ((blockPos.x % 32 > 0 && blockPos.x % 32 < 15) || (blockPos.z % 32 > 0 && blockPos.z % 32 < 15)) return "air"
            else {
                if (blockPos.x == 0 && blockPos.z >= 16) return "oak_stair[facing=west]"
                else if (blockPos.x == 15 && blockPos.z >= 16) return "oak_stair[facing=east]"
                else if (blockPos.z == 0 && blockPos.x >= 16) return "oak_stair[facing=north]"
                else if (blockPos.z == 15 && blockPos.x >= 16) return "oak_stair[facing=south]"
                else return "oak_log"
            }
        }
    } else {
        if ((blockPos.x % 32) > 15 && (blockPos.z % 32) > 15) {
            var build = utils.builds.GetBuild(socket)(world, Math.floor(blockPos.x / 32), Math.floor(blockPos.z / 32))

            if (build == undefined) return "air"
            else return world.builds[build].blocks[blockPos.y - 2][blockPos.z % 16][blockPos.x % 16]
        } else return "air"
    }
}

module.exports = {GenerateBlocks, GetBlock}