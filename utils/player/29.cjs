const { World, Socket, Position, Player } = require("../../data_structures.cjs");
const utils = require("../utils.cjs");

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
 */
function GetAlphaID(world, socket) {
    var selectedID = 0
    var invalidIDs = world.loadedPlayers.map(player => player.alphaID)
    while (true) {
        if (invalidIDs.includes(selectedID)) {
            selectedID++

            if (selectedID == 4294967296) return undefined
        } else return selectedID
    }
}

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
    var playerHeight = 1.7

    var blockCenter = {x: blockPos.x + 0.5, y: blockPos.y + 0.5, z: blockPos.z + 0.5}
    var playerCenter = {x: playerPos.x, y: playerPos.y + (playerHeight / 2), z: playerPos.z}

    var absDifference = {
        x: Math.round(Math.abs(blockCenter.x - playerCenter.x) * 32),
        y: Math.round(Math.abs(blockCenter.y - playerCenter.y) * 32),
        z: Math.round(Math.abs(blockCenter.z - playerCenter.z) * 32)
    }

    var minimumDistance = {
        x: Math.round(((playerWidth / 2) + 0.5) * 32),
        y: Math.round(((playerHeight / 2) + 0.5) * 32),
        z: Math.round(((playerWidth / 2) + 0.5) * 32)
    }
    
    // Debug Hitboxes
    //console.log(`blockCenter:      ${JSON.stringify(blockCenter)}`)
    //console.log(`playerCenter:     ${JSON.stringify(playerCenter)}`)
    //console.log(`absDifference:    ${JSON.stringify(absDifference)}`)
    //console.log(`minAbsDifference: ${JSON.stringify(minimumDistance)}`)

    if (absDifference.x < minimumDistance.x && absDifference.y < minimumDistance.y && absDifference.z < minimumDistance.z) return "inside"
    if (absDifference.x <= minimumDistance.x && absDifference.y <= minimumDistance.y && absDifference.z <= minimumDistance.z) return "against"
    return "none"
}

function CollidingWithChunkLayer(socket, playerPos, layerPos) {
    var playerWidth = 0.59375
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

function GetDirectionNESW(socket, yaw) {
    if (utils.math.NegMod(yaw + 45, 360) < 90) return "south"
    else if (utils.math.NegMod(yaw - 45, 360) < 90) return "west"
    else if (utils.math.NegMod(yaw - 135, 360) < 90) return "north"
    else if (utils.math.NegMod(yaw - 225, 360) < 90) return "east"

    return "???"
}

function GetDirection16(socket, yaw) {
    if (utils.math.NegMod(yaw + 11.25, 360) < 22.5) return "south"
    else if (utils.math.NegMod(yaw - 11.25, 360) < 22.5) return "south-southwest"
    else if (utils.math.NegMod(yaw - 33.75, 360) < 22.5) return "southwest"
    else if (utils.math.NegMod(yaw - 56.25, 360) < 22.5) return "west-southwest"
    else if (utils.math.NegMod(yaw - 78.75, 360) < 22.5) return "west"
    else if (utils.math.NegMod(yaw - 101.25, 360) < 22.5) return "west-northwest"
    else if (utils.math.NegMod(yaw - 123.75, 360) < 22.5) return "northwest"
    else if (utils.math.NegMod(yaw - 146.25, 360) < 22.5) return "north-northwest"
    else if (utils.math.NegMod(yaw - 168.75, 360) < 22.5) return "north"
    else if (utils.math.NegMod(yaw - 191.25, 360) < 22.5) return "north-northeast"
    else if (utils.math.NegMod(yaw - 213.75, 360) < 22.5) return "northeast"
    else if (utils.math.NegMod(yaw - 236.25, 360) < 22.5) return "east-northeast"
    else if (utils.math.NegMod(yaw - 258.75, 360) < 22.5) return "east"
    else if (utils.math.NegMod(yaw - 281.25, 360) < 22.5) return "east-southeast"
    else if (utils.math.NegMod(yaw - 303.75, 360) < 22.5) return "southeast"
    else if (utils.math.NegMod(yaw - 326.25, 360) < 22.5) return "south-southeast"

    return "???"
}

function GetDirection16Num(socket, yaw) {
    if (utils.math.NegMod(yaw + 11.25, 360) < 22.5) return 0
    else if (utils.math.NegMod(yaw - 11.25, 360) < 22.5) return 1
    else if (utils.math.NegMod(yaw - 33.75, 360) < 22.5) return 2
    else if (utils.math.NegMod(yaw - 56.25, 360) < 22.5) return 3
    else if (utils.math.NegMod(yaw - 78.75, 360) < 22.5) return 4
    else if (utils.math.NegMod(yaw - 101.25, 360) < 22.5) return 5
    else if (utils.math.NegMod(yaw - 123.75, 360) < 22.5) return 6
    else if (utils.math.NegMod(yaw - 146.25, 360) < 22.5) return 7
    else if (utils.math.NegMod(yaw - 168.75, 360) < 22.5) return 8
    else if (utils.math.NegMod(yaw - 191.25, 360) < 22.5) return 9
    else if (utils.math.NegMod(yaw - 213.75, 360) < 22.5) return 10
    else if (utils.math.NegMod(yaw - 236.25, 360) < 22.5) return 11
    else if (utils.math.NegMod(yaw - 258.75, 360) < 22.5) return 12
    else if (utils.math.NegMod(yaw - 281.25, 360) < 22.5) return 13
    else if (utils.math.NegMod(yaw - 303.75, 360) < 22.5) return 14
    else if (utils.math.NegMod(yaw - 326.25, 360) < 22.5) return 15

    return 0
}

module.exports = {GetPlayer, GetClassicID, GetAlphaID, GeneratePlayer, HasOpenInstance, CollidingWithBlock, CollidingWithChunkLayer, GetDirectionNESW, GetDirection16, GetDirection16Num}