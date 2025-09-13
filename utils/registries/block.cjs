const { World } = require("../../data_structures.cjs");

/**
 * @param {World} world 
 * @param {number} uvni 
 */
function GetBlockRegistry(world, uvni) {
    for (var i = 0; i < world.registries.block.length; i++) {
        if (uvni >= world.registries.block[i].minUVNI && uvni <= world.registries.block[i].minUVNI) return i
        else if (uvni < world.registries.block[i].minUVNI) return -1
    }

    return -1
}

/**
 * @param {World} world 
 * @param {number} registry 
 * @param {number} id 
 */
function GetBlockName(world, registry, id) {
    var registryEntries = Object.keys(world.registries.block[registry].entries)
    
    for (var i = 0; i < registryEntries.length; i++) {
        if (world.registries.block[registry].entries[registryEntries[i]] == id) return registryEntries[i]
    }

    return "air"
}

/**
 * @param {World} world 
 * @param {number} registry 
 * @param {string} block 
 */
function GetBlockID(world, registry, block) {
    var blockID = world.registries.block[registry].entries[block]
    if (blockID != undefined) return blockID
    else return 0
}

module.exports = {GetBlockRegistry, GetBlockName, GetBlockID}