const { World, Socket, Position } = require("../../data_structures.cjs");

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
            slots: [],
            bucket_tracker: {empty: 0, water: 0, lava: 0}
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
            id: "minecraft:dirt",
            count: 1,
            added_components: [],
            removed_components: []
        },{
            slot: 2,
            id: "minecraft:sponge",
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
            id: "minecraft:glass",
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

module.exports = {GetPlayer, GetClassicID, GeneratePlayer, HasOpenInstance, CollidingWithBlock, CollidingWithChunkLayer}