const {Socket} = require('../../../data_structures.cjs')
const dataWriter = require('../../../data_handlers/data_writer.cjs')
const packetWriter = require('../../../data_handlers/clientbound_packets/packet_writer.cjs')

/** 
 * @param {Socket} socket 
 */
function DespawnPlayer(socket, classicID) {
    packetWriter.Despawn_Player(socket)(socket, classicID)
}

module.exports = {DespawnPlayer}