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
    else {
        socket.log(`ERR: Cannot Get Build Info for Version ${socket.thisPlayer.upvn}:${socket.thisPlayer.uvni}`)
        return () => {return [""]}
    }
}

module.exports = {GetBuild, GenerateBuild, GetBuildInfo}