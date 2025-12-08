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

/**
 * @param {World} world 
 * @param {number} tileX 
 * @param {number} tileZ 
 * @param {string} creator 
 * @param {number} uvni 
 */
function GenerateBuild(world, tileX, tileZ, creator, uvni, settings) {
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
    returnValue.blockEntities = []
    returnValue.floor = "grass_block"
    returnValue.uvni = uvni
    returnValue.created = new Date().getTime()
    returnValue.lastModified = new Date().getTime()
    returnValue.save = true
    returnValue.settings = settings
    returnValue.settings.time = 0
    returnValue.scheduledBlockUpdates = []
    returnValue.music = {enabled: false, disc: "", blockPos: {x: 0, y: 0, z: 0}}

    returnValue.nearbyPlayers = []
    for (var i = 0; i < world.loadedPlayers.length; i++) {
        if ((16 + (32 * tileX) - (16 * world.config.simulationDistance) <= world.loadedPlayers[i].position.x) &&
            ((32 * tileX) + (16 * world.config.simulationDistance) >= world.loadedPlayers[i].position.x) &&
            (16 + (32 * tileZ) - (16 * world.config.simulationDistance) <= world.loadedPlayers[i].position.z) &&
            ((32 * tileZ) + (16 * world.config.simulationDistance) >= world.loadedPlayers[i].position.z)
        ) { returnValue.nearbyPlayers.push(world.loadedPlayers[i].username) }
    }
    
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

/**
 * @param {World} world 
 * @param {number} buildIndex 
 * @param {Position} blockPos 
 * @param {{}} data 
 */
function AddBlockEntityToBuild(world, buildIndex, blockPos, data) {
    for (var i = 0; i < world.builds[buildIndex].blockEntities.length; i++) {
        if (
            world.builds[buildIndex].blockEntities[i].position.x == blockPos.x &&
            world.builds[buildIndex].blockEntities[i].position.y == blockPos.y &&
            world.builds[buildIndex].blockEntities[i].position.z == blockPos.z
        ) {
            world.builds[buildIndex].blockEntities[i] = data
            return
        }
    } 

    world.builds[buildIndex].blockEntities.push(data)
}

/**
 * @param {World} world 
 * @param {number} buildIndex 
 * @param {Position} blockPos 
 * @param {{}} data 
 */
function RemoveBlockEntityFromBuild(world, buildIndex, blockPos) {
    for (var i = 0; i < world.builds[buildIndex].blockEntities.length; i++) {
        if (
            world.builds[buildIndex].blockEntities[i].position.x == blockPos.x &&
            world.builds[buildIndex].blockEntities[i].position.y == blockPos.y &&
            world.builds[buildIndex].blockEntities[i].position.z == blockPos.z
        ) {
            world.builds[buildIndex].blockEntities.slice(i, i + 1)
            return
        }
    }
}

module.exports = {GetBuild, GenerateBuild, SetBlockInBuild, AddBlockEntityToBuild, RemoveBlockEntityFromBuild}