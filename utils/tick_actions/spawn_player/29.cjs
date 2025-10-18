const {Socket} = require('../../../data_structures.cjs')
const dataWriter = require('../../../data_handlers/data_writer.cjs')
const packetWriter = require('../../../data_handlers/clientbound_packets/packet_writer.cjs')

/** 
 * @param {Socket} socket 
 */
function SpawnPlayer(socket, classicID, playerName, position, rotation) {
    packetWriter.Classic.Spawn_Player(socket)(socket, classicID, playerName, position, rotation)
}

module.exports = {SpawnPlayer}