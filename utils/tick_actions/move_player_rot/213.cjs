const {Socket, Position, Rotation} = require('../../../data_structures.cjs')
const dataWriter = require('../../../data_handlers/data_writer.cjs')
const packetWriter = require('../../../data_handlers/clientbound_packets/packet_writer.cjs')

/** 
 * @param {Socket} socket 
 * @param {number} classicID 
 * @param {Position} position 
 * @param {Rotation} rotation 
 */
function MovePlayer(socket, classicID, alphaID, position, rotation) {
    packetWriter.Alpha.Entity_Look(socket)(socket, alphaID, rotation)
}

module.exports = {MovePlayer}