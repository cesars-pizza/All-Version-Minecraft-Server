const {Socket} = require('../../../data_structures.cjs')
const dataWriter = require('../../../data_handlers/data_writer.cjs')
const packetWriter = require('../../../data_handlers/clientbound_packets/packet_writer.cjs')

/** 
 * @param {Socket} socket 
 */
function TeleportSelf(socket) {
    packetWriter.Classic.Despawn_Player(socket)(socket, socket.thisPlayer.classicID)
    packetWriter.Classic.Spawn_Player(socket)(socket, -1, socket.thisPlayer.username, socket.thisPlayer.position, socket.thisPlayer.rotation)
}

module.exports = {TeleportSelf}