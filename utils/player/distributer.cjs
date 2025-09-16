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
 * @param {Socket} socket 
 * @param {string} username 
 */
function GeneratePlayer(socket) {
    if (socket.thisPlayer.upvn >= -1 && socket.thisPlayer.upvn <= 4) return require('./29.cjs').GeneratePlayer
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
    else {
        socket.log(`ERR: Cannot Run Colliding With Block for Version ${socket.thisPlayer.upvn}:${socket.thisPlayer.uvni}`)
        return () => {}
    }
}

function CollidingWithChunkLayer(socket) {
    if (socket.thisPlayer.upvn >= -1 && socket.thisPlayer.upvn <= 4) return require('./29.cjs').CollidingWithChunkLayer
    else {
        socket.log(`ERR: Cannot Run Colliding With Chunk Layer for Version ${socket.thisPlayer.upvn}:${socket.thisPlayer.uvni}`)
        return () => {}
    }
}

module.exports = {GetPlayer, GetClassicID, GeneratePlayer, HasOpenInstance, CollidingWithBlock, CollidingWithChunkLayer}