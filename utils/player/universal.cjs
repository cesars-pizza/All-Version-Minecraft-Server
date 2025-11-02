const { World, Socket, Position, Player, Rotation } = require("../../data_structures.cjs");
const utils = require('../utils.cjs')

/**
 * @param {World} world 
 * @param {Player} player 
 */
function InitializePlayer(world, player, socket, username) {
    player.socket = socket

    // Save player connection-specific info
    var thisUPVN = player.upvn
    var thisUVNI = player.uvni

    // Get saved player data
    var newPlayer = utils.player.GetSavedPlayerData(world, player.socket, username)

    // Return player connection-specific info
    newPlayer.upvn = thisUPVN
    newPlayer.uvni = thisUVNI
    newPlayer.socket = socket

    // Get IDs
    newPlayer.classicID = utils.player.getID.Classic(world, newPlayer.socket)
    newPlayer.alphaID = utils.player.getID.Alpha(world, newPlayer.socket)
    
    // Get Registries
    newPlayer.selectedRegistries = {
        block: utils.registry.block.GetBlockRegistry(world, newPlayer.uvni),
        item: utils.registry.item.GetItemRegistry(world, newPlayer.uvni)
    }

    // Reset Ticking Settings
    newPlayer.digging = {
        blockPos: {x: 0, y: 0, z: 0},
        ticks: 0
    }
    newPlayer.tick = {spawn: true, position: {tick: false, x: 0, y: 0, z: 0}, rotation: false, heldItem: false, messages: [], systemMessages: [], errorMessages: [], teleportSelf: false, teleportOthers: false}
    newPlayer.floorChangeCooldown = 0
    
    // Misc. Settings
    newPlayer.otherPlayers = {}
    newPlayer.allowMovement = false
    newPlayer.joinCount++

    // Move player to edge of plot if inside
    if (utils.collisions.PlayerCollidingWithBuildVolume(socket)(newPlayer.position)) {
        utils.player.set.Position(world, newPlayer, {
            x: (Math.floor((newPlayer.position.x - 8) / 32) * 32) + 15.5,
            y: 2,
            z: (Math.floor((newPlayer.position.z - 8) / 32) * 32) + 15.5,
        }, true)
    }

    return newPlayer
}

/**
 * @param {World} world 
 * @param {string} username 
 */
function GetSavedPlayerData(world, socket, username) {
    var playerIndex = world.players.map(player => player.username).indexOf(username)

    if (playerIndex == -1) {
        var generatedPlayer = utils.player.GeneratePlayer(socket)(world, socket, username)
        world.players.push(generatedPlayer)
        return generatedPlayer
    }
    else return world.players[playerIndex]
}

/**
 * @param {World} world 
 * @param {string} username 
 */
function HasOpenInstance(world, username) {
    var includedLoaded = world.loadedPlayers.map(player => player.username).includes(username)
    var includedLoading = world.loadingPlayerNames.includes(username)

    return includedLoaded || includedLoading
}

const getID = {
    /**
     * @param {World} world 
     */
    Classic: (world, socket) => {
        var selectedID = 0
        var invalidIDs = world.loadedPlayers.map(player => player.classicID)
        while (true) {
            if (invalidIDs.includes(selectedID)) {
                if (selectedID >= 0) selectedID++
                else selectedID--

                if (selectedID == 128) return undefined
                else if (selectedID == -1) return undefined
            } else return selectedID
        }
    },

    /**
     * @param {World} world 
     */
    Alpha: (world, socket) => {
        var selectedID = 0
        var invalidIDs = world.loadedPlayers.map(player => player.alphaID)
        while (true) {
            if (invalidIDs.includes(selectedID)) {
                selectedID++

                if (selectedID == 4294967296) return undefined
            } else return selectedID
        }
    }
}

const set = {
    /**
     * @param {Player} player 
     * @param {Position} position 
     */
    Position: (world, player, position, ignoreWorldGen) => {
        var difX = position.x != player.position.x
        var difY = position.y != player.position.y
        var difZ = position.z != player.position.z

        if (difX || difZ) {
            player.classicWorldOffset = {
                x: Math.floor(position.x / 256),
                z: Math.floor(position.z / 256)
            }

            utils.player.DisplayBuildInfo(world, player, player.position, position)

            if (ignoreWorldGen !== true) utils.player.set.Position_Chunks(player.socket)(world, player, player.position, position)
        }

        if (difX || difY || difZ) {
            player.tick.position = {
                tick: true,
                x: position.x - player.position.x,
                y: position.y - player.position.y,
                z: position.z - player.position.z
            }
            
            player.position = position

            utils.collisions.PlayerCollisionFunctions(world, player.socket, position)
        }
    },

    /**
     * @param {Player} player 
     * @param {Rotation} rotation 
     */
    Rotation: (world, player, rotation) => {
        var difPitch = rotation.pitch != player.rotation.pitch
        var difYaw = rotation.yaw != player.rotation.yaw

        if (difPitch || difYaw) {
            player.rotation = rotation

            player.tick.rotation = true
        }
    },

    /**
     * @param {Player} player 
     * @param {Position} position 
     * @param {Rotation} rotation 
     */
    PositionAndRotation: (world, player, position, rotation) => {
        utils.player.set.Position(world, player, position)
        utils.player.set.Rotation(world, player, rotation)
    }
}

/**
 * @param {World} world 
 * @param {Socket} socket 
 * @param {Position} prevPosition 
 * @param {Position} position 
 * @param {Player} player 
 */
function DisplayBuildInfo(world, player, prevPosition, position) {
    if (player.settings.showPlotInfo) {
        var prevInBuild = utils.collisions.PlayerCollidingWithBuildVolume(player.socket)(prevPosition)
        var currInBuild = utils.collisions.PlayerCollidingWithBuildVolume(player.socket)(position)
        if (!prevInBuild && currInBuild) {
            var build = utils.builds.GetBuild(player.socket)(world, Math.floor(position.x / 32), Math.floor(position.z / 32))
            if (build != undefined && world.builds[build].creator != player.username) {
                var buildInfo = utils.builds.GetBuildInfo(player.socket)(world, player.socket, Math.floor(position.x / 32), Math.floor(position.z / 32))
                for (var i = 0; i < buildInfo.length; i++) {
                    player.tick.systemMessages.push(buildInfo[i])
                }
            }
        }
    }
}

module.exports = {InitializePlayer, GetSavedPlayerData, HasOpenInstance, getID, set, DisplayBuildInfo}