const {Socket, World} = require('../../data_structures')
const dataWriter = require('../../data_handlers/data_writer')
const packetWriter = require('../../data_handlers/clientbound_packets/packet_writer')
const utils = require('../utils')

/**
 * @param {World} world 
 * @param {Socket} socket 
 */
function Disconnect(world, socket) {
    world.loadingPlayerNames.splice(world.loadingPlayerNames.indexOf(""))

    packetWriter.Server_Identification(socket)(socket, "Server")

    var blocks = [[]]
    for (var z = 0; z < 256; z++) {
            blocks[0][z] = []
            for (var x = 0; x < 256; x++) {
                blocks[0][z][x] = 7
            }
        }
    for (var y = 1; y < 64; y++) {
        blocks[y] = []
        for (var z = 0; z < 256; z++) {
            blocks[y][z] = []
            for (var x = 0; x < 256; x++) {
                blocks[y][z][x] = 0
            }
        }
    }
    
    var thisPosition = {x: 0.5, y: 1, z: 0.5}
    var thisRotation = {pitch: 0, yaw: 0}

    if (socket.disconnect == "maxPlayers") {
        blocks = WriteString(blocks, "err", {x: 39, y: 10, z: 3})
        blocks = WriteString(blocks, "server full", {x: 39, y: 1, z: 3})
        thisPosition = {x: 11.875, y: 2.59375, z: 31.34375}
        thisRotation = {pitch: 252, yaw: 67}
    } else if (socket.disconnect == "invalidVersion") {
        blocks = WriteString(blocks, "err", {x: 64, y: 10, z: 3})
        blocks = WriteString(blocks, "unsupported version", {x: 64, y: 1, z: 3})
        thisPosition = {x: 18.71875, y: 2.59375, z: 54.375}
        thisRotation = {pitch: 1, yaw: 65}
    } else if (socket.disconnect == "multipleInstances") {
        blocks = WriteString(blocks, "err", {x: 64, y: 10, z: 3})
        blocks = WriteString(blocks, "already connected", {x: 64, y: 1, z: 3})
        thisPosition = {x: 23.4375, y: 2.59375, z: 43.625}
        thisRotation = {pitch: 0, yaw: 67}
    } else if (socket.disconnect == "unverified") {
        blocks = WriteString(blocks, "err", {x: 64, y: 10, z: 3})
        blocks = WriteString(blocks, "unverified client", {x: 64, y: 1, z: 3})
        thisPosition = {x: 25.15625, y: 2.59375, z: 46}
        thisRotation = {pitch: 255, yaw: 65}
    } else {
        blocks = WriteString(blocks, "err", {x: 39, y: 1, z: 3})
        thisPosition = {x: 30.625, y: 2.59375, z: 11.84375}
        thisRotation = {pitch: 252, yaw: 64}
    }

    utils.world_packets(socket)(socket, blocks)
    packetWriter.Spawn_Player(socket)(socket, -1, socket.thisPlayer.username, thisPosition, thisRotation)
}

function WriteCharacter(blocks, char, position) {
    if (char == 'a') {
        blocks[position.y + 0][position.z + 0][position.x + 0] = 12
        blocks[position.y + 1][position.z + 0][position.x + 0] = 12
        blocks[position.y + 2][position.z + 0][position.x + 0] = 12
        blocks[position.y + 3][position.z + 0][position.x + 0] = 12
        blocks[position.y + 4][position.z + 0][position.x + 0] = 12
        blocks[position.y + 5][position.z + 0][position.x + 0] = 12
        blocks[position.y + 0][position.z + 4][position.x + 0] = 12
        blocks[position.y + 1][position.z + 4][position.x + 0] = 12
        blocks[position.y + 2][position.z + 4][position.x + 0] = 12
        blocks[position.y + 3][position.z + 4][position.x + 0] = 12
        blocks[position.y + 4][position.z + 4][position.x + 0] = 12
        blocks[position.y + 5][position.z + 4][position.x + 0] = 12
        blocks[position.y + 4][position.z + 1][position.x + 0] = 12
        blocks[position.y + 4][position.z + 2][position.x + 0] = 12
        blocks[position.y + 4][position.z + 3][position.x + 0] = 12
        blocks[position.y + 6][position.z + 1][position.x + 0] = 12
        blocks[position.y + 6][position.z + 2][position.x + 0] = 12
        blocks[position.y + 6][position.z + 3][position.x + 0] = 12

        position.z += 6
    } else if (char == 'b') {
        blocks[position.y + 0][position.z + 0][position.x + 0] = 12
        blocks[position.y + 1][position.z + 0][position.x + 0] = 12
        blocks[position.y + 2][position.z + 0][position.x + 0] = 12
        blocks[position.y + 3][position.z + 0][position.x + 0] = 12
        blocks[position.y + 4][position.z + 0][position.x + 0] = 12
        blocks[position.y + 5][position.z + 0][position.x + 0] = 12
        blocks[position.y + 6][position.z + 0][position.x + 0] = 12
        blocks[position.y + 1][position.z + 4][position.x + 0] = 12
        blocks[position.y + 2][position.z + 4][position.x + 0] = 12
        blocks[position.y + 3][position.z + 4][position.x + 0] = 12
        blocks[position.y + 5][position.z + 4][position.x + 0] = 12
        blocks[position.y + 0][position.z + 1][position.x + 0] = 12
        blocks[position.y + 0][position.z + 2][position.x + 0] = 12
        blocks[position.y + 0][position.z + 3][position.x + 0] = 12
        blocks[position.y + 4][position.z + 1][position.x + 0] = 12
        blocks[position.y + 4][position.z + 2][position.x + 0] = 12
        blocks[position.y + 4][position.z + 3][position.x + 0] = 12
        blocks[position.y + 6][position.z + 1][position.x + 0] = 12
        blocks[position.y + 6][position.z + 2][position.x + 0] = 12
        blocks[position.y + 6][position.z + 3][position.x + 0] = 12

        position.z += 6
    } else if (char == 'c') {
        blocks[position.y + 1][position.z + 0][position.x + 0] = 12
        blocks[position.y + 2][position.z + 0][position.x + 0] = 12
        blocks[position.y + 3][position.z + 0][position.x + 0] = 12
        blocks[position.y + 4][position.z + 0][position.x + 0] = 12
        blocks[position.y + 5][position.z + 0][position.x + 0] = 12
        blocks[position.y + 1][position.z + 4][position.x + 0] = 12
        blocks[position.y + 5][position.z + 4][position.x + 0] = 12
        blocks[position.y + 0][position.z + 1][position.x + 0] = 12
        blocks[position.y + 0][position.z + 2][position.x + 0] = 12
        blocks[position.y + 0][position.z + 3][position.x + 0] = 12
        blocks[position.y + 6][position.z + 1][position.x + 0] = 12
        blocks[position.y + 6][position.z + 2][position.x + 0] = 12
        blocks[position.y + 6][position.z + 3][position.x + 0] = 12

        position.z += 6
    } else if (char == 'd') {
        blocks[position.y + 0][position.z + 0][position.x + 0] = 12
        blocks[position.y + 1][position.z + 0][position.x + 0] = 12
        blocks[position.y + 2][position.z + 0][position.x + 0] = 12
        blocks[position.y + 3][position.z + 0][position.x + 0] = 12
        blocks[position.y + 4][position.z + 0][position.x + 0] = 12
        blocks[position.y + 5][position.z + 0][position.x + 0] = 12
        blocks[position.y + 6][position.z + 0][position.x + 0] = 12
        blocks[position.y + 1][position.z + 4][position.x + 0] = 12
        blocks[position.y + 2][position.z + 4][position.x + 0] = 12
        blocks[position.y + 3][position.z + 4][position.x + 0] = 12
        blocks[position.y + 4][position.z + 4][position.x + 0] = 12
        blocks[position.y + 5][position.z + 4][position.x + 0] = 12
        blocks[position.y + 0][position.z + 1][position.x + 0] = 12
        blocks[position.y + 0][position.z + 2][position.x + 0] = 12
        blocks[position.y + 0][position.z + 3][position.x + 0] = 12
        blocks[position.y + 6][position.z + 1][position.x + 0] = 12
        blocks[position.y + 6][position.z + 2][position.x + 0] = 12
        blocks[position.y + 6][position.z + 3][position.x + 0] = 12

        position.z += 6
    } else if (char == 'e') {
        blocks[position.y + 0][position.z + 0][position.x + 0] = 12
        blocks[position.y + 1][position.z + 0][position.x + 0] = 12
        blocks[position.y + 2][position.z + 0][position.x + 0] = 12
        blocks[position.y + 3][position.z + 0][position.x + 0] = 12
        blocks[position.y + 4][position.z + 0][position.x + 0] = 12
        blocks[position.y + 5][position.z + 0][position.x + 0] = 12
        blocks[position.y + 6][position.z + 0][position.x + 0] = 12
        blocks[position.y + 0][position.z + 1][position.x + 0] = 12
        blocks[position.y + 0][position.z + 2][position.x + 0] = 12
        blocks[position.y + 0][position.z + 3][position.x + 0] = 12
        blocks[position.y + 0][position.z + 4][position.x + 0] = 12
        blocks[position.y + 4][position.z + 1][position.x + 0] = 12
        blocks[position.y + 4][position.z + 2][position.x + 0] = 12
        blocks[position.y + 6][position.z + 1][position.x + 0] = 12
        blocks[position.y + 6][position.z + 2][position.x + 0] = 12
        blocks[position.y + 6][position.z + 3][position.x + 0] = 12
        blocks[position.y + 6][position.z + 4][position.x + 0] = 12

        position.z += 6
    } else if (char == 'f') {
        blocks[position.y + 0][position.z + 0][position.x + 0] = 12
        blocks[position.y + 1][position.z + 0][position.x + 0] = 12
        blocks[position.y + 2][position.z + 0][position.x + 0] = 12
        blocks[position.y + 3][position.z + 0][position.x + 0] = 12
        blocks[position.y + 4][position.z + 0][position.x + 0] = 12
        blocks[position.y + 5][position.z + 0][position.x + 0] = 12
        blocks[position.y + 6][position.z + 0][position.x + 0] = 12
        blocks[position.y + 4][position.z + 1][position.x + 0] = 12
        blocks[position.y + 4][position.z + 2][position.x + 0] = 12
        blocks[position.y + 6][position.z + 1][position.x + 0] = 12
        blocks[position.y + 6][position.z + 2][position.x + 0] = 12
        blocks[position.y + 6][position.z + 3][position.x + 0] = 12
        blocks[position.y + 6][position.z + 4][position.x + 0] = 12

        position.z += 6
    } else if (char == 'g') {
        blocks[position.y + 1][position.z + 0][position.x + 0] = 12
        blocks[position.y + 2][position.z + 0][position.x + 0] = 12
        blocks[position.y + 3][position.z + 0][position.x + 0] = 12
        blocks[position.y + 4][position.z + 0][position.x + 0] = 12
        blocks[position.y + 5][position.z + 0][position.x + 0] = 12
        blocks[position.y + 1][position.z + 4][position.x + 0] = 12
        blocks[position.y + 2][position.z + 4][position.x + 0] = 12
        blocks[position.y + 3][position.z + 4][position.x + 0] = 12
        blocks[position.y + 4][position.z + 4][position.x + 0] = 12
        blocks[position.y + 0][position.z + 1][position.x + 0] = 12
        blocks[position.y + 0][position.z + 2][position.x + 0] = 12
        blocks[position.y + 0][position.z + 3][position.x + 0] = 12
        blocks[position.y + 4][position.z + 3][position.x + 0] = 12
        blocks[position.y + 6][position.z + 1][position.x + 0] = 12
        blocks[position.y + 6][position.z + 2][position.x + 0] = 12
        blocks[position.y + 6][position.z + 3][position.x + 0] = 12
        blocks[position.y + 6][position.z + 4][position.x + 0] = 12

        position.z += 6
    } else if (char == 'h') {
        blocks[position.y + 0][position.z + 0][position.x + 0] = 12
        blocks[position.y + 1][position.z + 0][position.x + 0] = 12
        blocks[position.y + 2][position.z + 0][position.x + 0] = 12
        blocks[position.y + 3][position.z + 0][position.x + 0] = 12
        blocks[position.y + 4][position.z + 0][position.x + 0] = 12
        blocks[position.y + 5][position.z + 0][position.x + 0] = 12
        blocks[position.y + 6][position.z + 0][position.x + 0] = 12
        blocks[position.y + 0][position.z + 4][position.x + 0] = 12
        blocks[position.y + 1][position.z + 4][position.x + 0] = 12
        blocks[position.y + 2][position.z + 4][position.x + 0] = 12
        blocks[position.y + 3][position.z + 4][position.x + 0] = 12
        blocks[position.y + 4][position.z + 4][position.x + 0] = 12
        blocks[position.y + 5][position.z + 4][position.x + 0] = 12
        blocks[position.y + 6][position.z + 4][position.x + 0] = 12
        blocks[position.y + 4][position.z + 1][position.x + 0] = 12
        blocks[position.y + 4][position.z + 2][position.x + 0] = 12
        blocks[position.y + 4][position.z + 3][position.x + 0] = 12

        position.z += 6
    } else if (char == 'i') {
        blocks[position.y + 0][position.z + 1][position.x + 0] = 12
        blocks[position.y + 1][position.z + 1][position.x + 0] = 12
        blocks[position.y + 2][position.z + 1][position.x + 0] = 12
        blocks[position.y + 3][position.z + 1][position.x + 0] = 12
        blocks[position.y + 4][position.z + 1][position.x + 0] = 12
        blocks[position.y + 5][position.z + 1][position.x + 0] = 12
        blocks[position.y + 6][position.z + 1][position.x + 0] = 12
        blocks[position.y + 0][position.z + 0][position.x + 0] = 12
        blocks[position.y + 0][position.z + 2][position.x + 0] = 12
        blocks[position.y + 6][position.z + 0][position.x + 0] = 12
        blocks[position.y + 6][position.z + 2][position.x + 0] = 12

        position.z += 4
    } else if (char == 'j') {
        blocks[position.y + 1][position.z + 0][position.x + 0] = 12
        blocks[position.y + 1][position.z + 4][position.x + 0] = 12
        blocks[position.y + 2][position.z + 4][position.x + 0] = 12
        blocks[position.y + 3][position.z + 4][position.x + 0] = 12
        blocks[position.y + 4][position.z + 4][position.x + 0] = 12
        blocks[position.y + 5][position.z + 4][position.x + 0] = 12
        blocks[position.y + 6][position.z + 4][position.x + 0] = 12
        blocks[position.y + 0][position.z + 1][position.x + 0] = 12
        blocks[position.y + 0][position.z + 2][position.x + 0] = 12
        blocks[position.y + 0][position.z + 3][position.x + 0] = 12

        position.z += 6
    } else if (char == 'k') {
        blocks[position.y + 0][position.z + 0][position.x + 0] = 12
        blocks[position.y + 1][position.z + 0][position.x + 0] = 12
        blocks[position.y + 2][position.z + 0][position.x + 0] = 12
        blocks[position.y + 3][position.z + 0][position.x + 0] = 12
        blocks[position.y + 4][position.z + 0][position.x + 0] = 12
        blocks[position.y + 5][position.z + 0][position.x + 0] = 12
        blocks[position.y + 6][position.z + 0][position.x + 0] = 12
        blocks[position.y + 0][position.z + 4][position.x + 0] = 12
        blocks[position.y + 1][position.z + 4][position.x + 0] = 12
        blocks[position.y + 2][position.z + 4][position.x + 0] = 12
        blocks[position.y + 6][position.z + 4][position.x + 0] = 12
        blocks[position.y + 4][position.z + 1][position.x + 0] = 12
        blocks[position.y + 4][position.z + 2][position.x + 0] = 12
        blocks[position.y + 3][position.z + 3][position.x + 0] = 12
        blocks[position.y + 5][position.z + 3][position.x + 0] = 12

        position.z += 6
    } else if (char == 'l') {
        blocks[position.y + 0][position.z + 0][position.x + 0] = 12
        blocks[position.y + 1][position.z + 0][position.x + 0] = 12
        blocks[position.y + 2][position.z + 0][position.x + 0] = 12
        blocks[position.y + 3][position.z + 0][position.x + 0] = 12
        blocks[position.y + 4][position.z + 0][position.x + 0] = 12
        blocks[position.y + 5][position.z + 0][position.x + 0] = 12
        blocks[position.y + 6][position.z + 0][position.x + 0] = 12
        blocks[position.y + 0][position.z + 1][position.x + 0] = 12
        blocks[position.y + 0][position.z + 2][position.x + 0] = 12
        blocks[position.y + 0][position.z + 3][position.x + 0] = 12
        blocks[position.y + 0][position.z + 4][position.x + 0] = 12

        position.z += 6
    } else if (char == 'm') {
        blocks[position.y + 0][position.z + 0][position.x + 0] = 12
        blocks[position.y + 1][position.z + 0][position.x + 0] = 12
        blocks[position.y + 2][position.z + 0][position.x + 0] = 12
        blocks[position.y + 3][position.z + 0][position.x + 0] = 12
        blocks[position.y + 4][position.z + 0][position.x + 0] = 12
        blocks[position.y + 5][position.z + 0][position.x + 0] = 12
        blocks[position.y + 6][position.z + 0][position.x + 0] = 12
        blocks[position.y + 0][position.z + 4][position.x + 0] = 12
        blocks[position.y + 1][position.z + 4][position.x + 0] = 12
        blocks[position.y + 2][position.z + 4][position.x + 0] = 12
        blocks[position.y + 3][position.z + 4][position.x + 0] = 12
        blocks[position.y + 4][position.z + 4][position.x + 0] = 12
        blocks[position.y + 5][position.z + 4][position.x + 0] = 12
        blocks[position.y + 6][position.z + 4][position.x + 0] = 12
        blocks[position.y + 5][position.z + 1][position.x + 0] = 12
        blocks[position.y + 4][position.z + 2][position.x + 0] = 12
        blocks[position.y + 5][position.z + 3][position.x + 0] = 12

        position.z += 6
    } else if (char == 'n') {
        blocks[position.y + 0][position.z + 0][position.x + 0] = 12
        blocks[position.y + 1][position.z + 0][position.x + 0] = 12
        blocks[position.y + 2][position.z + 0][position.x + 0] = 12
        blocks[position.y + 3][position.z + 0][position.x + 0] = 12
        blocks[position.y + 4][position.z + 0][position.x + 0] = 12
        blocks[position.y + 5][position.z + 0][position.x + 0] = 12
        blocks[position.y + 6][position.z + 0][position.x + 0] = 12
        blocks[position.y + 0][position.z + 4][position.x + 0] = 12
        blocks[position.y + 1][position.z + 4][position.x + 0] = 12
        blocks[position.y + 2][position.z + 4][position.x + 0] = 12
        blocks[position.y + 3][position.z + 4][position.x + 0] = 12
        blocks[position.y + 4][position.z + 4][position.x + 0] = 12
        blocks[position.y + 5][position.z + 4][position.x + 0] = 12
        blocks[position.y + 6][position.z + 4][position.x + 0] = 12
        blocks[position.y + 5][position.z + 1][position.x + 0] = 12
        blocks[position.y + 4][position.z + 2][position.x + 0] = 12
        blocks[position.y + 3][position.z + 3][position.x + 0] = 12

        position.z += 6
    } else if (char == 'o') {
        blocks[position.y + 1][position.z + 0][position.x + 0] = 12
        blocks[position.y + 2][position.z + 0][position.x + 0] = 12
        blocks[position.y + 3][position.z + 0][position.x + 0] = 12
        blocks[position.y + 4][position.z + 0][position.x + 0] = 12
        blocks[position.y + 5][position.z + 0][position.x + 0] = 12
        blocks[position.y + 1][position.z + 4][position.x + 0] = 12
        blocks[position.y + 2][position.z + 4][position.x + 0] = 12
        blocks[position.y + 3][position.z + 4][position.x + 0] = 12
        blocks[position.y + 4][position.z + 4][position.x + 0] = 12
        blocks[position.y + 5][position.z + 4][position.x + 0] = 12
        blocks[position.y + 0][position.z + 1][position.x + 0] = 12
        blocks[position.y + 0][position.z + 2][position.x + 0] = 12
        blocks[position.y + 0][position.z + 3][position.x + 0] = 12
        blocks[position.y + 6][position.z + 1][position.x + 0] = 12
        blocks[position.y + 6][position.z + 2][position.x + 0] = 12
        blocks[position.y + 6][position.z + 3][position.x + 0] = 12

        position.z += 6
    } else if (char == 'p') {
        blocks[position.y + 0][position.z + 0][position.x + 0] = 12
        blocks[position.y + 1][position.z + 0][position.x + 0] = 12
        blocks[position.y + 2][position.z + 0][position.x + 0] = 12
        blocks[position.y + 3][position.z + 0][position.x + 0] = 12
        blocks[position.y + 4][position.z + 0][position.x + 0] = 12
        blocks[position.y + 5][position.z + 0][position.x + 0] = 12
        blocks[position.y + 6][position.z + 0][position.x + 0] = 12
        blocks[position.y + 5][position.z + 4][position.x + 0] = 12
        blocks[position.y + 4][position.z + 1][position.x + 0] = 12
        blocks[position.y + 4][position.z + 2][position.x + 0] = 12
        blocks[position.y + 4][position.z + 3][position.x + 0] = 12
        blocks[position.y + 6][position.z + 1][position.x + 0] = 12
        blocks[position.y + 6][position.z + 2][position.x + 0] = 12
        blocks[position.y + 6][position.z + 3][position.x + 0] = 12

        position.z += 6
    } else if (char == 'q') {
        blocks[position.y + 1][position.z + 0][position.x + 0] = 12
        blocks[position.y + 2][position.z + 0][position.x + 0] = 12
        blocks[position.y + 3][position.z + 0][position.x + 0] = 12
        blocks[position.y + 4][position.z + 0][position.x + 0] = 12
        blocks[position.y + 5][position.z + 0][position.x + 0] = 12
        blocks[position.y + 0][position.z + 4][position.x + 0] = 12
        blocks[position.y + 2][position.z + 4][position.x + 0] = 12
        blocks[position.y + 3][position.z + 4][position.x + 0] = 12
        blocks[position.y + 4][position.z + 4][position.x + 0] = 12
        blocks[position.y + 5][position.z + 4][position.x + 0] = 12
        blocks[position.y + 0][position.z + 1][position.x + 0] = 12
        blocks[position.y + 0][position.z + 2][position.x + 0] = 12
        blocks[position.y + 1][position.z + 3][position.x + 0] = 12
        blocks[position.y + 6][position.z + 1][position.x + 0] = 12
        blocks[position.y + 6][position.z + 2][position.x + 0] = 12
        blocks[position.y + 6][position.z + 3][position.x + 0] = 12

        position.z += 6
    } else if (char == 'r') {
        blocks[position.y + 0][position.z + 0][position.x + 0] = 12
        blocks[position.y + 1][position.z + 0][position.x + 0] = 12
        blocks[position.y + 2][position.z + 0][position.x + 0] = 12
        blocks[position.y + 3][position.z + 0][position.x + 0] = 12
        blocks[position.y + 4][position.z + 0][position.x + 0] = 12
        blocks[position.y + 5][position.z + 0][position.x + 0] = 12
        blocks[position.y + 6][position.z + 0][position.x + 0] = 12
        blocks[position.y + 0][position.z + 4][position.x + 0] = 12
        blocks[position.y + 1][position.z + 4][position.x + 0] = 12
        blocks[position.y + 2][position.z + 4][position.x + 0] = 12
        blocks[position.y + 3][position.z + 4][position.x + 0] = 12
        blocks[position.y + 5][position.z + 4][position.x + 0] = 12
        blocks[position.y + 4][position.z + 1][position.x + 0] = 12
        blocks[position.y + 4][position.z + 2][position.x + 0] = 12
        blocks[position.y + 4][position.z + 3][position.x + 0] = 12
        blocks[position.y + 6][position.z + 1][position.x + 0] = 12
        blocks[position.y + 6][position.z + 2][position.x + 0] = 12
        blocks[position.y + 6][position.z + 3][position.x + 0] = 12

        position.z += 6
    } else if (char == 's') {
        blocks[position.y + 1][position.z + 0][position.x + 0] = 12
        blocks[position.y + 5][position.z + 0][position.x + 0] = 12
        blocks[position.y + 1][position.z + 4][position.x + 0] = 12
        blocks[position.y + 2][position.z + 4][position.x + 0] = 12
        blocks[position.y + 3][position.z + 4][position.x + 0] = 12
        blocks[position.y + 0][position.z + 1][position.x + 0] = 12
        blocks[position.y + 0][position.z + 2][position.x + 0] = 12
        blocks[position.y + 0][position.z + 3][position.x + 0] = 12
        blocks[position.y + 4][position.z + 1][position.x + 0] = 12
        blocks[position.y + 4][position.z + 2][position.x + 0] = 12
        blocks[position.y + 4][position.z + 3][position.x + 0] = 12
        blocks[position.y + 6][position.z + 1][position.x + 0] = 12
        blocks[position.y + 6][position.z + 2][position.x + 0] = 12
        blocks[position.y + 6][position.z + 3][position.x + 0] = 12
        blocks[position.y + 6][position.z + 4][position.x + 0] = 12

        position.z += 6
    } else if (char == 't') {
        blocks[position.y + 0][position.z + 2][position.x + 0] = 12
        blocks[position.y + 1][position.z + 2][position.x + 0] = 12
        blocks[position.y + 2][position.z + 2][position.x + 0] = 12
        blocks[position.y + 3][position.z + 2][position.x + 0] = 12
        blocks[position.y + 4][position.z + 2][position.x + 0] = 12
        blocks[position.y + 5][position.z + 2][position.x + 0] = 12
        blocks[position.y + 6][position.z + 2][position.x + 0] = 12
        blocks[position.y + 6][position.z + 0][position.x + 0] = 12
        blocks[position.y + 6][position.z + 1][position.x + 0] = 12
        blocks[position.y + 6][position.z + 3][position.x + 0] = 12
        blocks[position.y + 6][position.z + 4][position.x + 0] = 12

        position.z += 6
    } else if (char == 'u') {
        blocks[position.y + 1][position.z + 0][position.x + 0] = 12
        blocks[position.y + 2][position.z + 0][position.x + 0] = 12
        blocks[position.y + 3][position.z + 0][position.x + 0] = 12
        blocks[position.y + 4][position.z + 0][position.x + 0] = 12
        blocks[position.y + 5][position.z + 0][position.x + 0] = 12
        blocks[position.y + 6][position.z + 0][position.x + 0] = 12
        blocks[position.y + 1][position.z + 4][position.x + 0] = 12
        blocks[position.y + 2][position.z + 4][position.x + 0] = 12
        blocks[position.y + 3][position.z + 4][position.x + 0] = 12
        blocks[position.y + 4][position.z + 4][position.x + 0] = 12
        blocks[position.y + 5][position.z + 4][position.x + 0] = 12
        blocks[position.y + 6][position.z + 4][position.x + 0] = 12
        blocks[position.y + 0][position.z + 1][position.x + 0] = 12
        blocks[position.y + 0][position.z + 2][position.x + 0] = 12
        blocks[position.y + 0][position.z + 3][position.x + 0] = 12

        position.z += 6
    } else if (char == 'v') {
        blocks[position.y + 1][position.z + 1][position.x + 0] = 12
        blocks[position.y + 2][position.z + 1][position.x + 0] = 12
        blocks[position.y + 3][position.z + 0][position.x + 0] = 12
        blocks[position.y + 4][position.z + 0][position.x + 0] = 12
        blocks[position.y + 5][position.z + 0][position.x + 0] = 12
        blocks[position.y + 6][position.z + 0][position.x + 0] = 12
        blocks[position.y + 1][position.z + 3][position.x + 0] = 12
        blocks[position.y + 2][position.z + 3][position.x + 0] = 12
        blocks[position.y + 3][position.z + 4][position.x + 0] = 12
        blocks[position.y + 4][position.z + 4][position.x + 0] = 12
        blocks[position.y + 5][position.z + 4][position.x + 0] = 12
        blocks[position.y + 6][position.z + 4][position.x + 0] = 12
        blocks[position.y + 0][position.z + 2][position.x + 0] = 12

        position.z += 6
    } else if (char == 'w') {
        blocks[position.y + 0][position.z + 0][position.x + 0] = 12
        blocks[position.y + 1][position.z + 0][position.x + 0] = 12
        blocks[position.y + 2][position.z + 0][position.x + 0] = 12
        blocks[position.y + 3][position.z + 0][position.x + 0] = 12
        blocks[position.y + 4][position.z + 0][position.x + 0] = 12
        blocks[position.y + 5][position.z + 0][position.x + 0] = 12
        blocks[position.y + 6][position.z + 0][position.x + 0] = 12
        blocks[position.y + 0][position.z + 4][position.x + 0] = 12
        blocks[position.y + 1][position.z + 4][position.x + 0] = 12
        blocks[position.y + 2][position.z + 4][position.x + 0] = 12
        blocks[position.y + 3][position.z + 4][position.x + 0] = 12
        blocks[position.y + 4][position.z + 4][position.x + 0] = 12
        blocks[position.y + 5][position.z + 4][position.x + 0] = 12
        blocks[position.y + 6][position.z + 4][position.x + 0] = 12
        blocks[position.y + 1][position.z + 1][position.x + 0] = 12
        blocks[position.y + 2][position.z + 2][position.x + 0] = 12
        blocks[position.y + 1][position.z + 3][position.x + 0] = 12

        position.z += 6
    } else if (char == 'x') {
        blocks[position.y + 0][position.z + 0][position.x + 0] = 12
        blocks[position.y + 1][position.z + 0][position.x + 0] = 12
        blocks[position.y + 2][position.z + 0][position.x + 0] = 12
        blocks[position.y + 6][position.z + 0][position.x + 0] = 12
        blocks[position.y + 0][position.z + 4][position.x + 0] = 12
        blocks[position.y + 1][position.z + 4][position.x + 0] = 12
        blocks[position.y + 2][position.z + 4][position.x + 0] = 12
        blocks[position.y + 6][position.z + 4][position.x + 0] = 12
        blocks[position.y + 3][position.z + 1][position.x + 0] = 12
        blocks[position.y + 3][position.z + 3][position.x + 0] = 12
        blocks[position.y + 4][position.z + 2][position.x + 0] = 12
        blocks[position.y + 5][position.z + 1][position.x + 0] = 12
        blocks[position.y + 5][position.z + 3][position.x + 0] = 12

        position.z += 6
    } else if (char == 'y') {
        blocks[position.y + 0][position.z + 2][position.x + 0] = 12
        blocks[position.y + 1][position.z + 2][position.x + 0] = 12
        blocks[position.y + 2][position.z + 2][position.x + 0] = 12
        blocks[position.y + 3][position.z + 2][position.x + 0] = 12
        blocks[position.y + 4][position.z + 2][position.x + 0] = 12
        blocks[position.y + 6][position.z + 0][position.x + 0] = 12
        blocks[position.y + 6][position.z + 4][position.x + 0] = 12
        blocks[position.y + 5][position.z + 1][position.x + 0] = 12
        blocks[position.y + 5][position.z + 3][position.x + 0] = 12

        position.z += 6
    } else if (char == 'z') {
        blocks[position.y + 0][position.z + 0][position.x + 0] = 12
        blocks[position.y + 0][position.z + 1][position.x + 0] = 12
        blocks[position.y + 0][position.z + 2][position.x + 0] = 12
        blocks[position.y + 0][position.z + 3][position.x + 0] = 12
        blocks[position.y + 0][position.z + 4][position.x + 0] = 12
        blocks[position.y + 6][position.z + 0][position.x + 0] = 12
        blocks[position.y + 6][position.z + 1][position.x + 0] = 12
        blocks[position.y + 6][position.z + 2][position.x + 0] = 12
        blocks[position.y + 6][position.z + 3][position.x + 0] = 12
        blocks[position.y + 6][position.z + 4][position.x + 0] = 12
        blocks[position.y + 1][position.z + 0][position.x + 0] = 12
        blocks[position.y + 2][position.z + 1][position.x + 0] = 12
        blocks[position.y + 3][position.z + 2][position.x + 0] = 12
        blocks[position.y + 4][position.z + 3][position.x + 0] = 12
        blocks[position.y + 5][position.z + 4][position.x + 0] = 12

        position.z += 6
    } else if (char == ' ') {
        position.z += 6
    }

    return {blocks: blocks, position: position}
}

function WriteString(blocks, text, position) {
    for (var i = 0; i < text.length; i++) {
        var charReturn = WriteCharacter(blocks, text[i], position)
        blocks = charReturn.blocks
        position = charReturn.position
    }

    return blocks
}

module.exports = {Disconnect}