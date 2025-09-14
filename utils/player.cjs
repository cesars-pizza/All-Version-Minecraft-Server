const { World, Socket, Position } = require("../data_structures.cjs");

/**
 * @param {World} world 
 * @param {string} username 
 */
function GetPlayer(world, socket, username) {
    var playerIndex = world.players.map(player => player.username).indexOf(username)

    if (playerIndex == -1) {
        var generatedPlayer = GeneratePlayer(world, socket, username)
        world.players.push(generatedPlayer)
        return generatedPlayer
    }
    else return world.players[playerIndex]
}

/**
 * @param {World} world 
 */
function GetClassicID(world, socket) {
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
}

/**
 * @param {World} world 
 * @param {Socket} socket 
 * @param {string} username 
 */
function GeneratePlayer(world, socket, username) {
    var player = {
        uuid: "0",
        username: username,
        position: {x: 1.5, y: 1, z: 1.5},
        rotation: {pitch: 0, yaw: 0},
        inventory: {
            selected_slot: 0,
            slots: []
        },
        verified: false,
        keepUnverified: false,
        lastUVNI: socket.thisPlayer.uvni,
        save: true,
    }

    if (socket.thisPlayer.uvni == -1) {
        player.inventory.slots = [{
            slot: 0,
            id: "minecraft:stone",
            count: 1,
            added_components: [],
            removed_components: []
        },{
            slot: 1,
            id: "minecraft:dirt",
            count: 1,
            added_components: [],
            removed_components: []
        },{
            slot: 2,
            id: "minecraft:cobblestone",
            count: 1,
            added_components: [],
            removed_components: []
        },{
            slot: 3,
            id: "minecraft:oak_planks",
            count: 1,
            added_components: [],
            removed_components: []
        },{
            slot: 4,
            id: "minecraft:oak_sapling",
            count: 1,
            added_components: [],
            removed_components: []
        },{
            slot: 5,
            id: "minecraft:oak_log",
            count: 1,
            added_components: [],
            removed_components: []
        },{
            slot: 6,
            id: "minecraft:oak_leaves",
            count: 1,
            added_components: [],
            removed_components: []
        },{
            slot: 7,
            id: "minecraft:sand",
            count: 1,
            added_components: [],
            removed_components: []
        },{
            slot: 8,
            id: "minecraft:gravel",
            count: 1,
            added_components: [],
            removed_components: []
        }]
    }

    return player
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

/**
 * @param {Socket} socket 
 * @param {Position} playerPos 
 * @param {Position} blockPos 
 */
function CollidingWithBlock(socket, playerPos, blockPos) {
    var playerWidth = 0.59375
    var playerHeight = 0.7

    var blockCenter = {x: blockPos.x + 0.5, y: blockPos.y + 0.5, z: blockPos.z + 0.5}
    var playerCenter = {x: playerPos.x, y: playerPos.y + (playerHeight / 2), z: playerPos.z}

    var absDifference = {
        x: Math.abs(blockCenter.x - playerCenter.x),
        y: Math.abs(blockCenter.y - playerCenter.y),
        z: Math.abs(blockCenter.z - playerCenter.z)
    }

    if (absDifference.x < (playerWidth / 2) + 0.5 && absDifference.y < (playerHeight / 2) + 0.5 && absDifference.z < (playerWidth / 2) + 0.5) return true
    return false
}

function CollidingWithChunkLayer(socket, playerPos, layerPos) {
    var playerWidth = 0.59375
    var playerHeight = 0.7

    var blockCenter = {x: layerPos.x * 16 + 8, y: layerPos.y + 0.5, z: layerPos.z * 16 + 8}
    var playerCenter = {x: playerPos.x, y: playerPos.y + (playerHeight / 2), z: playerPos.z}

    var absDifference = {
        x: Math.abs(blockCenter.x - playerCenter.x),
        y: Math.abs(blockCenter.y - playerCenter.y),
        z: Math.abs(blockCenter.z - playerCenter.z)
    }

    if (absDifference.x < (playerWidth / 2) + 8 && absDifference.y < (playerHeight / 2) + 0.5 && absDifference.z < (playerWidth / 2) + 8) return true
    return false
}

module.exports = {GetPlayer, GetClassicID, GeneratePlayer, HasOpenInstance, CollidingWithBlock, CollidingWithChunkLayer}