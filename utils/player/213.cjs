const { World, Socket, Position } = require("../../data_structures.cjs");

/**
 * @param {Socket} socket 
 * @param {Position} playerPos 
 * @param {Position} blockPos 
 */
function CollidingWithBlock(socket, playerPos, blockPos) {
    var playerWidth = 0.59999998
    var playerHeight = 1.7

    var blockCenter = {x: blockPos.x + 0.5, y: blockPos.y + 0.5, z: blockPos.z + 0.5}
    var playerCenter = {x: playerPos.x, y: playerPos.y + (playerHeight / 2), z: playerPos.z}

    var absDifference = {
        x: Math.abs(blockCenter.x - playerCenter.x),
        y: Math.abs(blockCenter.y - playerCenter.y),
        z: Math.abs(blockCenter.z - playerCenter.z)
    }

    var minimumDistance = {
        x: ((playerWidth / 2) + 0.5), 
        y: ((playerHeight / 2) + 0.5),
        z: ((playerWidth / 2) + 0.5) 
    }
    
    // Debug Hitboxes
    // console.log(`blockCenter:      ${JSON.stringify(blockCenter)}`)
    // console.log(`playerCenter:     ${JSON.stringify(playerCenter)}`)
    // console.log(`absDifference:    ${JSON.stringify(absDifference)}`)
    // console.log(`minAbsDifference: ${JSON.stringify(minimumDistance)}`)

    if (absDifference.x < minimumDistance.x && absDifference.y < minimumDistance.y && absDifference.z < minimumDistance.z) return "inside"
    if (absDifference.x <= minimumDistance.x && absDifference.y <= minimumDistance.y && absDifference.z <= minimumDistance.z) return "against"
    return "none"
}

function CollidingWithChunkLayer(socket, playerPos, layerPos) {
    var playerWidth = 0.4
    var playerHeight = 1.7

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
    var player = {
        uuid: "0",
        username: username,
        position: {x: 1.5, y: 1, z: 1.5},
        rotation: {pitch: 0, yaw: 0},
        inventory: {
            selected_slot: 0,
            slots: [],
            bucket_tracker: {empty: 1, water: 1, lava: 1}
        },
        verified: false,
        keepUnverified: false,
        lastUVNI: socket.thisPlayer.uvni,
        joinCount: 0,
        save: true
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
    }

    return player
}

module.exports = {CollidingWithBlock, CollidingWithChunkLayer, GeneratePlayer}