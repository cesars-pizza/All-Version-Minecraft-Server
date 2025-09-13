const {Socket, World} = require('../../data_structures.cjs')
const dataWriter = require('../../data_handlers/data_writer.cjs')
const packetWriter = require('../../data_handlers/clientbound_packets/packet_writer.cjs')
const utils = require('../utils.cjs')
const { GetBlockID } = require('../registries/block.cjs')

/**
 * @param {World} world 
 * @param {Socket} socket 
 * @param {number} chunkX 
 * @param {number} chunkZ 
 * @param {number} height 
 * @param {[]} builds 
 */
function GenerateBlocks(world, socket, chunkX, chunkZ, height, builds) {
    var airID = GetBlockID(world, socket.thisPlayer.selectedRegistries.block, "air")
    var cobblestoneID = GetBlockID(world, socket.thisPlayer.selectedRegistries.block, "cobblestone")
    var grassID = GetBlockID(world, socket.thisPlayer.selectedRegistries.block, "grass_block")
    var logID = GetBlockID(world, socket.thisPlayer.selectedRegistries.block, "oak_log")

    var blocks = [[], []]

    var chunkTypeX = utils.math.NegMod(chunkX, 2)
    var chunkTypeZ = utils.math.NegMod(chunkZ, 2)
    for (var z = 0; z < 16; z++) {
        blocks[0][z] = []
        blocks[1][z] = []
        for (var z = 0; z < 16; z++) {
            blocks[0][z][z] = cobblestoneID


            if (chunkTypeX == 1 && chunkTypeZ == 1) blocks[1][z][z] = grassID
            else blocks[1][z][z] = airID
        }
    }
    if (chunkTypeX == 0 || chunkTypeZ == 0) {
        blocks[1][0][0] = logID
        blocks[1][15][0] = logID
        blocks[1][0][15] = logID
        blocks[1][15][15] = logID

        if (chunkTypeX == 1) {
            for (var z = 1; z < 15; z++) {
                blocks[1][0][z]= logID
                blocks[1][15][z] = logID
            }
        } else if (chunkTypeZ == 1) {
            for (var z = 1; z < 15; z++) {
                blocks[1][z][0] = logID
                blocks[1][z][15] = logID
            }
        }
    }

    for (var y = 2; y < height; y++) {
        blocks[y] = []
        for (var z = 0; z < 16; z++) {
            blocks[y][z] = []
            for (var z = 0; z < 16; z++) {
                blocks[y][z][z] = airID
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
 * @param {number} height 
 * @param {[]} builds 
 */
function GenerateClassicWorld(world, socket, offsetX, offsetZ, height, builds) {
    var blocks = []
    for (var y = 0; y < height; y++) {
        blocks[y] = []
        for (var z = 0; z < 256; z++) {
            blocks[y][z] = []
        }
    }

    for (var x = 16 * offsetX; x < 16 * (offsetX + 1); x++) {
        for (var z = 16 * offsetZ; z < 16 * (offsetZ + 1); z++) {
            var chunk = GenerateBlocks(world, socket, x, z, height, builds)
            for (var innerY = 0; innerY < height; innerY++) {
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

module.exports = {GenerateClassicWorld, GenerateBlocks}