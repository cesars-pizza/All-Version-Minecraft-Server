const {World, Build, Position} = require('../../data_structures.cjs');
const utils = require('../utils.cjs');

/**
 * @param {World} world 
 * @param {number} x 
 * @param {number} z 
 */
function GetBuild(world, x, z) {
    for (var i = 0; i < world.builds.length; i++) {
        if (world.builds[i].x == x && world.builds[i].z == z) return i
    }
    return undefined
}

function GenerateBuild(tileX, tileZ, creator, uvni, settings) {
    var blocks = []
    for (var y = 0; y < 62; y++) {
        blocks[y] = []
        for (var z = 0; z < 16; z++) {
            blocks[y][z] = []
            for (var x = 0; x < 16; x++) {
                blocks[y][z][x] = "air"
            }
        }
    }

    var returnValue = new Build()
    returnValue.x = tileX
    returnValue.z = tileZ
    returnValue.creator = creator
    returnValue.size = "small"
    returnValue.blocks = blocks
    returnValue.floor = "grass_block"
    returnValue.uvni = uvni
    returnValue.created = new Date().getTime()
    returnValue.lastModified = new Date().getTime()
    returnValue.save = true
    returnValue.settings = settings
    returnValue.scheduledBlockUpdates = []
    returnValue.music = {enabled: false, disc: "", blockPos: {x: 0, y: 0, z: 0}}
    return returnValue
}

/**
 * @param {World} world 
 * @param {number} buildIndex 
 * @param {Position} blockPos 
 * @param {string} block 
 */
function SetBlockInBuild(world, buildIndex, blockPos, block) {
    world.builds[buildIndex].blocks[blockPos.y - 2][utils.math.NegMod(blockPos.z, 16)][utils.math.NegMod(blockPos.x, 16)] = block
}

module.exports = {GetBuild, GenerateBuild, SetBlockInBuild}