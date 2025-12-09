const { World, Socket, Position, Player } = require("../../data_structures.cjs");
const utils = require('../utils.cjs')
const packet_writer = require("../../data_handlers/clientbound_packets/packet_writer.cjs");

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
        slots: {type: "player"},
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

    var playerItems = [
        "stone", "cobblestone", "bricks", "dirt", "oak_planks", "oak_log", "oak_leaves", "torch", "smooth_stone_slab",
        "grass_block", "bucket", "water_bucket", "lava_bucket", "sand", "gravel", "gold_ore", "iron_ore", "coal_ore",
        "oak_sapling", "bedrock", "sponge", "glass", "white_wool", "dandelion", "poppy", "brown_mushroom", "red_mushroom",
        "gold_block", "iron_block", "tnt", "bookshelf", "mossy_cobblestone", "obsidian", "flint_and_steel", "spawner", "oak_stairs"
    ]
    var playerItemCounts = [
        64, 64, 64, 64, 64, 64, 64, 64, 64,
        64, 1, 1, 1, 64, 64, 64, 64, 64,
        64, 64, 64, 64, 64, 64, 64, 64, 64,
        64, 64, 64, 64, 64, 64, 1, 64, 64
    ]
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
    Position_Chunks: (world, player, prevPosition, position) => {
        var prevChunk = {x: Math.floor(prevPosition.x / 16), z: Math.floor(prevPosition.z / 16)}
        var newChunk = {x: Math.floor(position.x / 16), z: Math.floor(position.z / 16)}

        if (prevChunk.x != newChunk.x || prevChunk.z != newChunk.z) {
            utils.world_packets.GenerateRenderDistance(player.socket)(world, player.socket, world.config.renderDistance.default, newChunk.x, newChunk.z, prevChunk.x, prevChunk.z)
        }
    }
}

module.exports = {GeneratePlayer, set}