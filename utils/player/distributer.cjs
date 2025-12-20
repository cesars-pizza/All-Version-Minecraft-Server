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
    if (socket.thisPlayer.upvn >= 8 && socket.thisPlayer.upvn <= 10) return require('./213.cjs').GeneratePlayer
    if (socket.thisPlayer.upvn >= 11 && socket.thisPlayer.upvn <= 26) return require('./222.cjs').GeneratePlayer
    else {
        socket.log(`ERR: Cannot Run Generate Player for Version ${socket.thisPlayer.upvn}:${socket.thisPlayer.uvni}`)
        return () => {}
    }
}

function HasOpenInstance(world, username) {
    return require('./universal.cjs').HasOpenInstance(world, username)
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

    Sneaking: (world, player, isSneaking) => {
        return require('./universal.cjs').set.Sneaking(world, player, isSneaking)
    },

    Position_Chunks: (socket) => {
        if (socket.thisPlayer.upvn >= -1 && socket.thisPlayer.upvn <= 4) return require('./29.cjs').set.Position_Chunks
        if (socket.thisPlayer.upvn >= 8 && socket.thisPlayer.upvn <= 26) return require('./213.cjs').set.Position_Chunks
        else {
            socket.log(`ERR: Cannot Run Set Position (Chunks) for Version ${socket.thisPlayer.upvn}:${socket.thisPlayer.uvni}`)
            return () => {}
        }
    }
}

function EnterBuildPlot(world, player, prevPosition, position) {
    return require('./universal.cjs').EnterBuildPlot(world, player, prevPosition, position)
}

module.exports = {
    InitializePlayer, GetSavedPlayerData, GeneratePlayer, HasOpenInstance, getID, set, EnterBuildPlot
}