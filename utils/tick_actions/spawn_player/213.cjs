const {Socket} = require('../../../data_structures.cjs')
const dataWriter = require('../../../data_handlers/data_writer.cjs')
const packetWriter = require('../../../data_handlers/clientbound_packets/packet_writer.cjs')

/** 
 * @param {Socket} socket 
 */
function SpawnPlayer(socket, classicID, alphaID, playerName, position, rotation, heldItem) {
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
}

module.exports = {SpawnPlayer}