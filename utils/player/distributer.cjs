const { World, Socket, Position } = require("../../data_structures.cjs");

/**
 * @param {World} world 
 * @param {string} username 
 */
function GetPlayer(socket) {
    return require('./29.cjs').GetPlayer
}

/**
 * @param {World} world 
 */
function GetClassicID(socket) {
    return require('./29.cjs').GetClassicID
}

/**
 * @param {World} world 
 */
function GetAlphaID(socket) {
    return require('./29.cjs').GetAlphaID
}

/**
 * @param {World} world 
 * @param {Socket} socket 
 * @param {string} username 
 */
function GeneratePlayer(socket) {
    if (socket.thisPlayer.upvn >= -1 && socket.thisPlayer.upvn <= 1) return require('./29.cjs').GeneratePlayer
    if (socket.thisPlayer.upvn == 2) return require('./51.cjs').GeneratePlayer
    if (socket.thisPlayer.upvn >= 3 && socket.thisPlayer.upvn <= 4) return require('./55.cjs').GeneratePlayer
    else {
        socket.log(`ERR: Cannot Run Generate Player for Version ${socket.thisPlayer.upvn}:${socket.thisPlayer.uvni}`)
        return () => {}
    }
}

/**
 * @param {World} world 
 * @param {string} username 
 */
function HasOpenInstance(socket) {
    return require('./29.cjs').HasOpenInstance
}

/**
 * @param {Socket} socket 
 * @param {Position} playerPos 
 * @param {Position} blockPos 
 */
function CollidingWithBlock(socket) {
    if (socket.thisPlayer.upvn >= -1 && socket.thisPlayer.upvn <= 4) return require('./29.cjs').CollidingWithBlock
    if (socket.thisPlayer.upvn >= 8 && socket.thisPlayer.upvn <= 15) return require('./213.cjs').CollidingWithBlock
    else {
        socket.log(`ERR: Cannot Run Colliding With Block for Version ${socket.thisPlayer.upvn}:${socket.thisPlayer.uvni}`)
        return () => {}
    }
}

function CollidingWithChunkLayer(socket) {
    if (socket.thisPlayer.upvn >= -1 && socket.thisPlayer.upvn <= 4) return require('./29.cjs').CollidingWithChunkLayer
    if (socket.thisPlayer.upvn >= 8 && socket.thisPlayer.upvn <= 15) return require('./213.cjs').CollidingWithChunkLayer
    else {
        socket.log(`ERR: Cannot Run Colliding With Chunk Layer for Version ${socket.thisPlayer.upvn}:${socket.thisPlayer.uvni}`)
        return () => {}
    }
}

function GetDirectionNESW(socket) {
    return require('./29.cjs').GetDirectionNESW
}

module.exports = {GetPlayer, GetClassicID, GetAlphaID, GeneratePlayer, HasOpenInstance, CollidingWithBlock, CollidingWithChunkLayer, GetDirectionNESW}