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
        slots: {type: "playerFull"},
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

    var playerItems = ["stone", "dirt", "cobblestone", "oak_planks", "oak_sapling", "oak_log", "oak_leaves", "sand", "gravel"]
    var playerItemCounts = [64, 64, 64, 64, 64, 64, 64, 64, 64]
    var playerFullInventory = []

    for (var i = 0; i < playerItems.length; i++) {
        if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.item.includes(playerItems[i])) {
            playerFullInventory.push({
                id: playerItems[i],
                count: playerItemCounts[i],
                added_components: [],
                removed_components: []
            })
        }
    }

    player.inventory.slots.hotbar = playerFullInventory.slice(0, 9)
    player.inventory.slots.inventory = playerFullInventory.slice(9)

    return player
}

const set = {
    Position_Chunks: () => {}
}

module.exports = {GeneratePlayer, set}