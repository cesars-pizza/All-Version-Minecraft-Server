const {World} = require("../data_structures.cjs")

/**
 * @param {World} world 
 * @param {string} block 
 * @param {string} tag 
 * @returns 
 */
function GetBlockHasTag(world, block, tag) {
    if (block == "" || block == undefined) return false

    return GetTagValues(world, tag).includes(block.split('[')[0])
}

/**
 * @param {World} world 
 * @param {string} tag 
 */
function GetTagValues(world, tag) {
    var tagIndex = world.tags.map(worldTag => worldTag.tag).indexOf(tag)

    if (tagIndex == -1) return []
    else return world.tags[tagIndex].values
}

module.exports = {GetBlockHasTag}