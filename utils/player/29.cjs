const packet_writer = require("../../data_handlers/clientbound_packets/packet_writer.cjs");
const { World, Socket, Position, Player } = require("../../data_structures.cjs");
const utils = require("../utils.cjs");

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
        held_item: "stone",
        slots: [],
        bucket_tracker: {empty: 0, water: 0, lava: 0}
    },
    player.settings = {
        showPlotInfo: true,
        defaultBuildSettings: {blockUpdates: true, redstoneUpdates: true, liquidUpdates: true, publicInteractions: true}
    },
    player.verified = false,
    player.keepUnverified = false,
    player.lastUVNI = socket.thisPlayer.uvni,
    player.currentTime = 0,
    player.joinCount = 0,
    player.save = true

    player.inventory.slots = [{
        slot: 0,
        id: "stone",
        count: 1,
        added_components: [],
        removed_components: []
    },{
        slot: 1,
        id: "dirt",
        count: 1,
        added_components: [],
        removed_components: []
    },{
        slot: 2,
        id: "cobblestone",
        count: 1,
        added_components: [],
        removed_components: []
    },{
        slot: 3,
        id: "oak_planks",
        count: 1,
        added_components: [],
        removed_components: []
    },{
        slot: 4,
        id: "oak_sapling",
        count: 1,
        added_components: [],
        removed_components: []
    },{
        slot: 5,
        id: "oak_log",
        count: 1,
        added_components: [],
        removed_components: []
    },{
        slot: 6,
        id: "oak_leaves",
        count: 1,
        added_components: [],
        removed_components: []
    },{
        slot: 7,
        id: "sand",
        count: 1,
        added_components: [],
        removed_components: []
    },{
        slot: 8,
        id: "gravel",
        count: 1,
        added_components: [],
        removed_components: []
    }]

    return player
}

const set = {
    Position_Chunks: () => {}
}

module.exports = {GeneratePlayer, set}