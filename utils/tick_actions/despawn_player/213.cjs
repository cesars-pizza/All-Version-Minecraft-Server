const {Socket} = require('../../../data_structures.cjs')
const dataWriter = require('../../../data_handlers/data_writer.cjs')
const packetWriter = require('../../../data_handlers/clientbound_packets/packet_writer.cjs')

/** 
 * @param {Socket} socket 
 */
function DespawnPlayer(socket, classicID, alphaID) {
    packetWriter.Alpha.Destroy_Entity(socket)(socket, alphaID)
}

module.exports = {DespawnPlayer}