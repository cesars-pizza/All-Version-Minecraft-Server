const { World, Socket, Position, Player } = require("../../data_structures.cjs");

/**
 * @param {World} world 
 * @param {Socket} socket 
 * @param {string} username 
 */
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
        bucket_tracker: {empty: 0, water: 0, lava: 0}
    },
    player.settings = {
        showPlotInfo: true,
        defaultBuildSettings: {blockUpdates: true, redstoneUpdates: true, liquidUpdates: true}
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

module.exports = {GetPlayer, GetClassicID, GeneratePlayer, HasOpenInstance, CollidingWithBlock, CollidingWithChunkLayer}