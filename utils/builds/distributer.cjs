const {World, Socket} = require('../../data_structures.cjs');

/**
 * @param {World} world 
 * @param {number} x 
 * @param {number} z 
 */
function GetBuild(socket) {
    return require('./29.cjs').GetBuild
}

function GenerateBuild(socket) {
    return require('./29.cjs').GenerateBuild
}

/**
 * @param {Socket} socket 
 */
function GetBuildInfo(socket) {
    return require('./universal.cjs').GetBuildInfo
}

function SetBlockInBuild(socket) {
    return require('./29.cjs').SetBlockInBuild
}

/**
 * @param {World} world 
 * @param {number} buildIndex 
 * @param {Position} blockPos 
 * @param {{}} data 
 */
function AddBlockEntityToBuild(socket) {
    return require('./29.cjs').AddBlockEntityToBuild
}

/**
 * @param {World} world 
 * @param {number} buildIndex 
 * @param {Position} blockPos 
 * @param {{}} data 
 */
function RemoveBlockEntityFromBuild(socket) {
    return require('./29.cjs').RemoveBlockEntityFromBuild
}

module.exports = {GetBuild, GenerateBuild, GetBuildInfo, SetBlockInBuild, AddBlockEntityToBuild, RemoveBlockEntityFromBuild}