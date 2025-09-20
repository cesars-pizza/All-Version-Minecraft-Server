const {Socket} = require('../../../data_structures.cjs')
const dataWriter = require('../../../data_handlers/data_writer.cjs')
const packetWriter = require('../../../data_handlers/clientbound_packets/packet_writer.cjs')

/** 
 * @param {Socket} socket 
 */
function TeleportSelf(socket) {
    packetWriter.Despawn_Player(socket)(socket, socket.thisPlayer.classicID)
    packetWriter.Spawn_Player(socket)(socket, socket.thisPlayer.classicID, socket.thisPlayer.username, socket.thisPlayer.position, socket.thisPlayer.rotation)
}

module.exports = {TeleportSelf}