const {World, Socket} = require('../../data_structures.cjs');
const utils = require('../utils.cjs')

/**
 * @param {World} world 
 * @param {Socket} socket 
 * @param {number} x 
 * @param {number} z 
 */
function GetBuildInfo(world, socket, x, z) {
    var build = utils.builds.GetBuild(socket)(world, x, z)

    if (build == undefined) return [
        `Plot ${x}, ${z}: Owned by Unknown`,
        `Created: Unknown`,
        `Modified: Unknown`,
        `Version: Unknown`
    ]
    else {
        return [
            `Plot ${x}, ${z}: Owned by ${world.builds[build].creator}`,
            `Created: ${new Date(world.builds[build].created).toLocaleString()}`,
            `Modified: ${new Date(world.builds[build].lastModified).toLocaleString()}`,
            `Version: ${utils.registry.version.GetVersion(world, world.builds[build].uvni).name}`
        ]
    }
}

module.exports = {GetBuildInfo}