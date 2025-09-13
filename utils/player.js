const { World, Socket } = require("../data_structures");

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
        position: {x: 1, y: 70, z: 1},
        rotation: {pitch: 0, yaw: 0},
        inventory: {
            selected_slot: 0,
            slots: []
        },
        verified: false,
        keepUnverified: false,
        lastUVNI: socket.uvni,
        save: true
    }

    if (socket.uvni == -1) {
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

module.exports = {GetPlayer, GetClassicID, GeneratePlayer, HasOpenInstance}