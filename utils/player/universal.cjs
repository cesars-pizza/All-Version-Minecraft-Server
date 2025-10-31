const { World, Socket, Position, Player, Rotation } = require("../../data_structures.cjs");
const utils = require('../utils.cjs')

/**
 * @param {Player} player 
 * @param {Position} position 
 */
function SetPosition(world, player, position) {
    var difX = position.x != player.position.x
    var difY = position.y != player.position.y
    var difZ = position.z != player.position.z

    if (difX || difZ) {
        player.classicWorldOffset = {
            x: Math.floor(position.x / 256),
            z: Math.floor(position.z / 256)
        }

        utils.player.DisplayBuildInfo(player.socket)(world, player, player.position, position)

        utils.player.SetPosition_Chunks(player.socket)(world, player, player.position, position)
    }

    if (difX || difY || difZ) {
        player.tick.position = {
            tick: true,
            x: position.x - player.position.x,
            y: position.y - player.position.y,
            z: position.z - player.position.z
        }
        
        player.position = position

        utils.player.PlayerCollisionFunctions(player.socket)(world, player.socket, position)
    }
}

/**
 * @param {Player} player 
 * @param {Rotation} rotation 
 */
function SetRotation(world, player, rotation) {
    var difPitch = rotation.pitch != player.rotation.pitch
    var difYaw = rotation.yaw != player.rotation.yaw

    if (difPitch || difYaw) {
        player.rotation = rotation

        player.tick.rotation = true
    }
}

/**
 * @param {Player} player 
 * @param {Position} position 
 * @param {Rotation} rotation 
 */
function SetPositionAndRotation(world, player, position, rotation) {
    utils.player.SetPosition(world, player, position)
    utils.player.SetRotation(world, player, rotation)
}

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
    var newPlayer = utils.player.GetPlayer(player.socket)(world, player.socket, username)

    // Return player connection-specific info
    newPlayer.upvn = thisUPVN
    newPlayer.uvni = thisUVNI
    newPlayer.socket = socket

    // Get IDs
    newPlayer.classicID = utils.player.GetClassicID(newPlayer.socket)(world, newPlayer.socket)
    newPlayer.alphaID = utils.player.GetAlphaID(newPlayer.socket)(world, newPlayer.socket)
    
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
    if (utils.math.NegMod(newPlayer.position.x, 32) >= 16 && utils.math.NegMod(newPlayer.position.z, 32) >= 16) {
        utils.player.SetPosition(world, newPlayer, {
        x: Math.floor(newPlayer.position.x / 16) * 16 - 0.5,
        y: 2,
        z: Math.floor(newPlayer.position.z / 16) * 16 - 0.5,
    })}

    return newPlayer
}

module.exports = {SetPosition, SetRotation, SetPositionAndRotation, InitializePlayer}