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
    if (socket.thisPlayer.upvn >= 0 && socket.thisPlayer.upvn <= 4) return require('./42.cjs').GetBuildInfo
    if (socket.thisPlayer.upvn >= 8 && socket.thisPlayer.upvn <= 15) return require('./213.cjs').GetBuildInfo
    else {
        socket.log(`ERR: Cannot Get Build Info for Version ${socket.thisPlayer.upvn}:${socket.thisPlayer.uvni}`)
        return () => {return [""]}
    }
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