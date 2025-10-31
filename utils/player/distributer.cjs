const { World, Socket, Position, Player, Rotation } = require("../../data_structures.cjs");
const utils = require('../utils.cjs')

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

function CollidingWithFullBlock(socket) {
    return require('./29.cjs').CollidingWithFullBlock
}

function CollidingWithPressurePlate(socket) {
    return require('./29.cjs').CollidingWithPressurePlate
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

function GetDirection16(socket) {
    return require('./29.cjs').GetDirection16
}

function GetDirection16Num(socket) {
    return require('./29.cjs').GetDirection16Num
}

function InBuildChunk(socket) {
    return require('./29.cjs').InBuildChunk
}

function PlayerCollisionFunctions(socket) {
    return require('./29.cjs').PlayerCollisionFunctions
}

/**
 * @param {Player} player 
 * @param {Position} position 
 */
function SetPosition(world, player, position) {
    return require('./universal.cjs').SetPosition(world, player, position)
}

/**
 * @param {Player} player 
 * @param {Rotation} rotation 
 */
function SetRotation(world, player, rotation) {
    return require('./universal.cjs').SetRotation(world, player, rotation)
}

/**
 * @param {Player} player 
 * @param {Position} position 
 * @param {Rotation} rotation 
 */
function SetPositionAndRotation(world, player, position, rotation) {
    return require('./universal.cjs').SetPositionAndRotation(world, player, position, rotation)
}

function SetPosition_Chunks(socket) {
    if (socket.thisPlayer.upvn >= -1 && socket.thisPlayer.upvn <= 4) return require('./29.cjs').SetPosition_Chunks
    if (socket.thisPlayer.upvn >= 8 && socket.thisPlayer.upvn <= 15) return require('./213.cjs').SetPosition_Chunks
    else {
        socket.log(`ERR: Cannot Run Set Position (Chunks) for Version ${socket.thisPlayer.upvn}:${socket.thisPlayer.uvni}`)
        return () => {}
    }
}

function DisplayBuildInfo(socket) {
    if (socket.thisPlayer.upvn >= -1 && socket.thisPlayer.upvn <= 4) return require('./29.cjs').DisplayBuildInfo
    if (socket.thisPlayer.upvn >= 8 && socket.thisPlayer.upvn <= 15) return require('./213.cjs').DisplayBuildInfo
    else {
        socket.log(`ERR: Cannot Run Display Build Info for Version ${socket.thisPlayer.upvn}:${socket.thisPlayer.uvni}`)
        return () => {}
    }
}

function InitializePlayer(world, player, socket, username) {
    return require('./universal.cjs').InitializePlayer(world, player, socket, username)
}

module.exports = {GetPlayer, GetClassicID, GetAlphaID, GeneratePlayer, HasOpenInstance, CollidingWithBlock, CollidingWithFullBlock, CollidingWithPressurePlate, CollidingWithChunkLayer, GetDirectionNESW, GetDirection16, GetDirection16Num, InBuildChunk, PlayerCollisionFunctions, SetPosition, SetPosition_Chunks, SetPositionAndRotation, SetRotation, DisplayBuildInfo, InitializePlayer}