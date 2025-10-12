const {World, Build} = require('../../data_structures.cjs');

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
    return returnValue
}

module.exports = {GetBuild, GenerateBuild}