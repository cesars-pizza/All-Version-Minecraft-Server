const {Socket} = require('../../../data_structures.cjs')
const dataWriter = require('../../../data_handlers/data_writer.cjs')
const packetWriter = require('../../../data_handlers/clientbound_packets/packet_writer.cjs')

/** 
 * @param {Socket} socket 
 */
function SpawnPlayer(socket, classicID, alphaID, playerName, position, rotation, heldItem) {
    var distance = Math.pow(position.x - socket.thisPlayer.position.x, 2) + Math.pow(position.z - socket.thisPlayer.position.z, 2)
    if (distance < 4096) { // sqrt(4096) = 64
        packetWriter.Alpha.Entity(socket)(socket, alphaID)
        packetWriter.Alpha.Named_Entity_Spawn(socket)(socket, alphaID, playerName, position, rotation, heldItem)
        socket.thisPlayer.otherPlayers[alphaID] = {
            rendered: true,
            estimatedPosition: {
                x: Math.floor(position.x * 32) / 32,
                y: Math.floor(position.y * 32) / 32,
                z: Math.floor(position.z * 32) / 32
            }
        }
    } else {
        socket.thisPlayer.otherPlayers[alphaID] = {
            rendered: false,
            estimatedPosition: {x: 0, y: 0, z: 0}
        }
    }
}

module.exports = {SpawnPlayer}