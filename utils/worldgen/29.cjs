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

    var blocks = [[], []]

    var chunkTypeX = utils.math.NegMod(chunkX, 2)
    var chunkTypeZ = utils.math.NegMod(chunkZ, 2)
    for (var z = 0; z < 16; z++) {
        blocks[0][z] = []
        blocks[1][z] = []
        for (var x = 0; x < 16; x++) {
            blocks[0][z][x] = cobblestoneID

            if (chunkTypeX == 1 && chunkTypeZ == 1) {
                var buildIndex = utils.builds.GetBuild(world, Math.floor(chunkX / 2), Math.floor(chunkZ / 2))
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
                blocks[1][0][x]= logID
                blocks[1][15][x] = logID
            }
        } else if (chunkTypeZ == 1) {
            for (var z = 1; z < 15; z++) {
                blocks[1][z][0] = logID
                blocks[1][z][15] = logID
            }
        }
    }

    var hasBuild = -1
    if (chunkTypeX == 1 && chunkTypeZ == 1) {
        var buildIndex = utils.builds.GetBuild(world, Math.floor(chunkX / 2), Math.floor(chunkZ / 2))
        if (buildIndex != undefined) hasBuild = buildIndex
    }
    if (hasBuild >= 0) {
        for (var y = 2; y < 64; y++) {
            blocks[y] = []
            for (var z = 0; z < 16; z++) {
                blocks[y][z] = []
                for (var x = 0; x < 16; x++) {
                    blocks[y][z][x] = utils.registry.block.GetBlockID(world, socket.thisPlayer.selectedRegistries.block, world.builds[buildIndex].blocks[y - 2][z][x])
                }
            }
        }
    } else {
        for (var y = 2; y < 64; y++) {
            blocks[y] = []
            for (var z = 0; z < 16; z++) {
                blocks[y][z] = []
                for (var x = 0; x < 16; x++) {
                    blocks[y][z][x] = airID
                }
            }
        }
    }

    return blocks
}

/**
 * @param {World} world 
 * @param {Socket} socket 
 * @param {number} offsetX 
 * @param {number} offsetZ 
 */
function GenerateClassicWorld(world, socket, offsetX, offsetZ) {
    var blocks = []
    for (var y = 0; y < 64; y++) {
        blocks[y] = []
        for (var z = 0; z < 256; z++) {
            blocks[y][z] = []
        }
    }

    for (var x = 16 * offsetX; x < 16 * (offsetX + 1); x++) {
        for (var z = 16 * offsetZ; z < 16 * (offsetZ + 1); z++) {
            var chunk = GenerateBlocks(world, socket, x, z)
            for (var innerY = 0; innerY < 64; innerY++) {
                for (var innerZ = 0; innerZ < 16; innerZ++) {
                    for (var innerX = 0; innerX < 16; innerX++) {
                        blocks[innerY][innerZ + 16 * z][innerX + 16 * x] = chunk[innerY][innerZ][innerX]
                    }
                }
            }
        }
    }

    return blocks
}

/**
 * @param {World} world 
 * @param {Position} blockPos 
 */
function GetBlock(world, blockPos) {
    if (blockPos.y == 0) return "cobblestone"
    else if (blockPos.y == 1) {
        if ((blockPos.x % 32) > 15 && (blockPos.z % 32) > 15) {
            var build = utils.builds.GetBuild(world, Math.floor(blockPos.x / 32), Math.floor(blockPos.z / 32))

            if (build == undefined) return "grass_block"
            else return world.builds[build].floor
        } else {
            if ((blockPos.x % 32 > 0 && blockPos.x % 32 < 15) || (blockPos.z % 32 > 0 && blockPos.z % 32 < 15)) return "air"
            else return "oak_log"
        }
    } else {
        if ((blockPos.x % 32) > 15 && (blockPos.z % 32) > 15) {
            var build = utils.builds.GetBuild(world, Math.floor(blockPos.x / 32), Math.floor(blockPos.z / 32))

            if (build == undefined) return "air"
            else return world.builds[build].blocks[blockPos.y - 2][blockPos.z % 16][blockPos.x % 16]
        } else return "air"
    }
}

module.exports = {GenerateClassicWorld, GenerateBlocks, GetBlock}