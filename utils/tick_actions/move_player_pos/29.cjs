const {Socket, Position, Rotation} = require('../../../data_structures.cjs')
const dataWriter = require('../../../data_handlers/data_writer.cjs')
const packetWriter = require('../../../data_handlers/clientbound_packets/packet_writer.cjs')

/** 
 * @param {Socket} socket 
 * @param {number} classicID 
 * @param {Position} position 
 * @param {Rotation} rotation 
 */
function MovePlayer(socket, classicID, alphaID, position, rotation, estimatedPrevPosition, playerName, heldItem, sneaking) {
    if (sneaking) position.y -= 0.375
    packetWriter.Classic.Set_Position_and_Orientation(socket)(socket, classicID, position, rotation)
}

module.exports = {MovePlayer}