const {World} = require('../../data_structures.cjs');

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

function GenerateBuild(tileX, tileZ, creator, uvni) {
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

    return {
        x: tileX,
        z: tileZ,
        creator: creator,
        size: "small",
        blocks: blocks,
        floor: "grass_block",
        uvni: uvni,
        created: new Date().getTime(),
        lastModified: new Date().getTime(),
        save: true
    }
}

module.exports = {GetBuild, GenerateBuild}