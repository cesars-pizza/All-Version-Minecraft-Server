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
        `&cPlot ${x}, ${z}: Owned by Unknown`,
        `&cCreated: Unknown`,
        `&cModified: Unknown`,
        `&cVersion: Unknown`
    ]
    else {
        return [
            `&bPlot ${x}, ${z}: Owned by ${world.builds[build].creator}`,
            `&bCreated: ${new Date(world.builds[build].created).toLocaleString()}`,
            `&bModified: ${new Date(world.builds[build].lastModified).toLocaleString()}`,
            `&bVersion: ${utils.registry.version.GetVersion(world, world.builds[build].uvni).name}`
        ]
    }
}

module.exports = {GetBuildInfo}