const { World, Socket, Position, Player } = require("../../data_structures.cjs");
const utils = require('../utils.cjs')

/**
 * @param {Socket} socket 
 * @param {Position} playerPos 
 * @param {Position} blockPos 
 */
function CollidingWithBlock(world, socket, playerPos, blockPos, block) {
    var playerWidth = 0.59999998
    var playerHeight = 1.69999998

    if (utils.tag(world, block, "pressure_plates")) return utils.player.CollidingWithPressurePlate({})(playerPos, playerHeight, playerWidth, blockPos)
    else return utils.player.CollidingWithFullBlock({})(playerPos, playerHeight, playerWidth, blockPos)
}

function CollidingWithChunkLayer(socket, playerPos, layerPos) {
    var playerWidth = 0.59999998
    var playerHeight = 1.69999998

    var blockCenter = {x: layerPos.x * 16 + 8, y: layerPos.y + 0.5, z: layerPos.z * 16 + 8}
    var playerCenter = {x: playerPos.x, y: playerPos.y + (playerHeight / 2), z: playerPos.z}

    var absDifference = {
        x: Math.round(Math.abs(blockCenter.x - playerCenter.x) * 32),
        y: Math.round(Math.abs(blockCenter.y - playerCenter.y) * 32),
        z: Math.round(Math.abs(blockCenter.z - playerCenter.z) * 32)
    }

    var minimumDistance = {
        x: Math.round(((playerWidth / 2) + 8) * 32),
        y: Math.round(((playerHeight / 2) + 0.5) * 32),
        z: Math.round(((playerWidth / 2) + 8) * 32)
    }

    if (absDifference.x < minimumDistance.x && absDifference.y < minimumDistance.y && absDifference.z < minimumDistance.z) return "inside"
    if (absDifference.x <= minimumDistance.x && absDifference.y <= minimumDistance.y && absDifference.z <= minimumDistance.z) return "against"
    return "none"
}

function GeneratePlayer(world, socket, username) {
    var player = new Player()

    player.uuid = "0",
    player.username = username,
    player.position = {x: 1.5, y: 1, z: 1.5},
    player.rotation = {pitch: 0, yaw: 0},
    player.classicWorldOffset = {x: 0, z: 0},
    player.inventory = {
        selected_slot: 0,
        slots: [],
        bucket_tracker: {empty: 1, water: 1, lava: 1}
    },
    player.settings = {
        showPlotInfo: true,
        defaultBuildSettings: {blockUpdates: true, redstoneUpdates: true, liquidUpdates: true, publicInteractions: true}
    },
    player.verified = false,
    player.keepUnverified = false,
    player.lastUVNI = socket.thisPlayer.uvni,
    player.joinCount = 0,
    player.save = true

    player.inventory.slots = [{
        slot: 0,
        id: "minecraft:stone",
        count: 1,
        added_components: [],
        removed_components: []
    },{
        slot: 1,
        id: "minecraft:cobblestone",
        count: 1,
        added_components: [],
        removed_components: []
    },{
        slot: 2,
        id: "minecraft:dirt",
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
        id: "minecraft:oak_log",
        count: 1,
        added_components: [],
        removed_components: []
    },{
        slot: 5,
        id: "minecraft:oak_leaves",
        count: 1,
        added_components: [],
        removed_components: []
    },{
        slot: 6,
        id: "minecraft:oak_sapling",
        count: 1,
        added_components: [],
        removed_components: []
    },{
        slot: 7,
        id: "minecraft:dandelion",
        count: 1,
        added_components: [],
        removed_components: []
    },{
        slot: 8,
        id: "minecraft:poppy",
        count: 1,
        added_components: [],
        removed_components: []
    }]

    return player
}

module.exports = {CollidingWithBlock, CollidingWithChunkLayer, GeneratePlayer}