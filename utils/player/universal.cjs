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
    newPlayer.currentTime = 0
    newPlayer.otherPlayers = {}
    newPlayer.allowMovement = false
    newPlayer.sneaking = false
    newPlayer.joinCount++

    // Move player to edge of plot if inside
    if (utils.collisions.PlayerCollidingWithBuildVolume(socket)(newPlayer.position)) {
        utils.player.set.Position(world, newPlayer, {
            x: (Math.floor((newPlayer.position.x - 8) / 32) * 32) + 15.5,
            y: 2,
            z: (Math.floor((newPlayer.position.z - 8) / 32) * 32) + 15.5,
        }, true)
    }

    // Set Plot Ticks
    var plotTick = {
        min: {
            x: Math.floor((newPlayer.position.x - (16 * world.config.simulationDistance)) / 32),
            z: Math.floor((newPlayer.position.z - (16 * world.config.simulationDistance)) / 32)
        }, max: {
            x: Math.floor((newPlayer.position.x + (16 * world.config.simulationDistance) - 16) / 32),
            z: Math.floor((newPlayer.position.z + (16 * world.config.simulationDistance) - 16) / 32)
        }
    }
    for (var x = plotTick.min.x; x <= plotTick.max.x; x++) {
        for (var z = plotTick.min.z; z <= plotTick.max.z; z++) {
            var selectedBuild = utils.builds.GetBuild(socket)(world, x, z)
            if (selectedBuild !== undefined) world.builds[selectedBuild].nearbyPlayers.push(username)
        }
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
     * @param {World} world
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

            utils.player.EnterBuildPlot(world, player, player.position, position)

            if (ignoreWorldGen !== true) { 
                var plotTick = {
                    min: {
                        x: Math.floor((position.x - (16 * world.config.simulationDistance)) / 32),
                        z: Math.floor((position.z - (16 * world.config.simulationDistance)) / 32)
                    }, max: {
                        x: Math.floor((position.x + (16 * world.config.simulationDistance) - 16) / 32),
                        z: Math.floor((position.z + (16 * world.config.simulationDistance) - 16) / 32)
                    }
                }
                var prevPlotTick = {
                    min: {
                        x: Math.floor((player.position.x - (16 * world.config.simulationDistance)) / 32),
                        z: Math.floor((player.position.z - (16 * world.config.simulationDistance)) / 32)
                    }, max: {
                        x: Math.floor((player.position.x + (16 * world.config.simulationDistance) - 16) / 32),
                        z: Math.floor((player.position.z + (16 * world.config.simulationDistance) - 16) / 32)
                    }
                }

                var plotTickBoxes = utils.math.CalculateCollidingBoxes(plotTick, prevPlotTick)
                
                for (var i = 0; i < plotTickBoxes.new.length; i++) {
                    for (var x = plotTickBoxes.new[i].min.x; x <= plotTickBoxes.new[i].max.x; x++) {
                        for (var z = plotTickBoxes.new[i].min.z; z <= plotTickBoxes.new[i].max.z; z++) {
                            var selectedBuild = utils.builds.GetBuild({})(world, x, z)
                            if (selectedBuild !== undefined) world.builds[selectedBuild].nearbyPlayers.push(player.username)
                        }
                    }
                }

                for (var i = 0; i < plotTickBoxes.obsolete.length; i++) {
                    for (var x = plotTickBoxes.obsolete[i].min.x; x <= plotTickBoxes.obsolete[i].max.x; x++) {
                        for (var z = plotTickBoxes.obsolete[i].min.z; z <= plotTickBoxes.obsolete[i].max.z; z++) {
                            var selectedBuild = utils.builds.GetBuild({})(world, x, z)
                            if (selectedBuild !== undefined) world.builds[selectedBuild].nearbyPlayers.splice(world.builds[selectedBuild].nearbyPlayers.indexOf(player.username), 1)
                        }
                    }
                }

                utils.player.set.Position_Chunks(player.socket)(world, player, player.position, position)
            }
        }

        if (difX || difY || difZ) {
            player.tick.position = {
                tick: true,
                x: position.x - player.position.x,
                y: position.y - player.position.y,
                z: position.z - player.position.z
            }
            player.save = true
            
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
            player.save = true
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
    },

    /**
     * @param {Player} player 
     * @param {Position} position 
     * @param {Rotation} rotation 
     */
    Sneaking: (world, player, isSneaking) => {
        if (player.sneaking != isSneaking) {
            player.sneaking = isSneaking
            player.tick.position.tick = true
            player.save = true
        }
    }
}

/**
 * @param {World} world 
 * @param {Socket} socket 
 * @param {Position} prevPosition 
 * @param {Position} position 
 * @param {Player} player 
 */
function EnterBuildPlot(world, player, prevPosition, position) {
    var prevInBuild = utils.collisions.PlayerCollidingWithBuildVolume(player.socket)(prevPosition)
    var currInBuild = utils.collisions.PlayerCollidingWithBuildVolume(player.socket)(position)

    if (!prevInBuild && currInBuild) {
        var build = utils.builds.GetBuild(player.socket)(world, Math.floor((position.x - 3) / 32), Math.floor((position.z - 3) / 32))
        
        if (build != undefined) player.currentTime = world.builds[build].settings.time

        if (player.settings.showPlotInfo) {
            if (build != undefined && world.builds[build].creator != player.username) {
                var buildInfo = utils.builds.GetBuildInfo(player.socket)(world, player.socket, Math.floor((position.x - 3) / 32), Math.floor((position.z - 3) / 32))
                for (var i = 0; i < buildInfo.length; i++) {
                    player.tick.systemMessages.push(buildInfo[i])
                }
            }
        }
    }
}

module.exports = {InitializePlayer, GetSavedPlayerData, HasOpenInstance, getID, set, EnterBuildPlot}