const { World } = require("../../data_structures.cjs");

/**
 * @param {World} world 
 * @param {number} uvni 
 */
function GetVersion(world, uvni) {
    var version = world.versions[uvni]
    if (version.supported == false) return {
        supported: false,
        name: "Unknown"
    } 
    else return version
}

module.exports = {GetVersion}