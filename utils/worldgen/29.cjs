const {Socket} = require('../../data_structures.cjs')
const dataWriter = require('../../data_handlers/data_writer.cjs')
const packetWriter = require('../../data_handlers/clientbound_packets/packet_writer.cjs')
const utils = require('../utils.cjs')

/**
 * @param {number} chunkX 
 * @param {number} chunkZ 
 * @param {number} height 
 * @param {[]} builds 
 */
function GenerateBlocks(chunkX, chunkZ, height, builds) {
    var blocks = [[], []]

    var chunkTypeX = utils.math.NegMod(chunkX, 2)
    var chunkTypeZ = utils.math.NegMod(chunkZ, 2)
    for (var z = 0; z < 16; z++) {
        blocks[0][z] = []
        blocks[1][z] = []
        for (var x = 0; x < 16; x++) {
            blocks[0][z][x] = "cobblestone"


            if (chunkTypeX == 1 && chunkTypeZ == 1) blocks[1][z][x] = "grass_block"
            else blocks[1][z][x] = "air"
        }
    }
    if (chunkTypeX == 0 || chunkTypeZ == 0) {
        blocks[1][0][0] = "oak_log"
        blocks[1][15][0] = "oak_log"
        blocks[1][0][15] = "oak_log"
        blocks[1][15][15] = "oak_log"

        if (chunkTypeX == 1) {
            for (var x = 1; x < 15; x++) {
                blocks[1][x][0] = "oak_log"
                blocks[1][x][15] = "oak_log"
            }
        } else if (chunkTypeZ == 1) {
            for (var x = 1; x < 15; x++) {
                blocks[1][0][x]= "oak_log"
                blocks[1][15][x] = "oak_log"
            }
        }
    }

    for (var y = 2; y < height; y++) {
        blocks[y] = []
        for (var z = 0; z < 16; z++) {
            blocks[y][z] = []
            for (var x = 0; x < 16; x++) {
                blocks[y][z][x] = "air"
            }
        }
    }

    return blocks
}

/**
 * @param {number} offsetX 
 * @param {number} offsetZ 
 * @param {number} height 
 * @param {[]} builds 
 */
function GenerateClassicWorld(offsetX, offsetZ, height, builds) {
    var blocks = []
    for (var y = 0; y < height; y++) {
        blocks[y] = []
        for (var z = 0; z < 256; z++) {
            blocks[y][z] = []
        }
    }

    for (var x = 16 * offsetX; x < 16 * (offsetX + 1); x++) {
        for (var z = 16 * offsetZ; z < 16 * (offsetZ + 1); z++) {
            var chunk = GenerateBlocks(x, z, height, builds)
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