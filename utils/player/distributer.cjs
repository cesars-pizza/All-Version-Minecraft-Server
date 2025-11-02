const { World, Socket, Position, Player, Rotation } = require("../../data_structures.cjs");

function InitializePlayer(world, player, socket, username) {
    return require('./universal.cjs').InitializePlayer(world, player, socket, username)
}

function GetSavedPlayerData(world, socket, username) {
    return require('./universal.cjs').GetSavedPlayerData(world, socket, username)
}

function GeneratePlayer(socket) {
    if (socket.thisPlayer.upvn >= -1 && socket.thisPlayer.upvn <= 1) return require('./29.cjs').GeneratePlayer
    if (socket.thisPlayer.upvn == 2) return require('./51.cjs').GeneratePlayer
    if (socket.thisPlayer.upvn >= 3 && socket.thisPlayer.upvn <= 4) return require('./55.cjs').GeneratePlayer
    else {
        socket.log(`ERR: Cannot Run Generate Player for Version ${socket.thisPlayer.upvn}:${socket.thisPlayer.uvni}`)
        return () => {}
    }
}

function HasOpenInstance() {
    return require('./29.cjs').HasOpenInstance
}

const getID = {
    Classic: (world, socket) => {
        return require('./universal.cjs').getID.Classic(world, socket)
    },

    Alpha: (world, socket) => {
        return require('./universal.cjs').getID.Alpha(world, socket)
    }
}

const set = {
    Position: (world, player, position, ignoreWorldGen) => {
        return require('./universal.cjs').set.Position(world, player, position, ignoreWorldGen)
    },

    Rotation: (world, player, rotation) => {
        return require('./universal.cjs').set.Rotation(world, player, rotation)
    },

    PositionAndRotation: (world, player, position, rotation) => {
        return require('./universal.cjs').set.PositionAndRotation(world, player, position, rotation)
    },

    Position_Chunks: (socket) => {
        if (socket.thisPlayer.upvn >= -1 && socket.thisPlayer.upvn <= 4) return require('./29.cjs').set.Position_Chunks
        if (socket.thisPlayer.upvn >= 8 && socket.thisPlayer.upvn <= 15) return require('./213.cjs').set.Position_Chunks
        else {
            socket.log(`ERR: Cannot Run Set Position (Chunks) for Version ${socket.thisPlayer.upvn}:${socket.thisPlayer.uvni}`)
            return () => {}
        }
    }
}

function DisplayBuildInfo(world, player, prevPosition, position) {
    return require('./universal.cjs').DisplayBuildInfo(world, player, prevPosition, position)
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

function InBuildChunk(socket) {
    return require('./29.cjs').InBuildChunk
}

function PlayerCollisionFunctions(socket) {
    return require('./29.cjs').PlayerCollisionFunctions
}

module.exports = {
    InitializePlayer, GetSavedPlayerData, GeneratePlayer, HasOpenInstance, getID, set, DisplayBuildInfo,
    CollidingWithBlock, CollidingWithChunkLayer, CollidingWithFullBlock, CollidingWithPressurePlate, InBuildChunk, PlayerCollisionFunctions
}