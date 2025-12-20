const {Socket, Position, Rotation} = require('../../../data_structures.cjs')
const dataWriter = require('../../../data_handlers/data_writer.cjs')
const packetWriter = require('../../../data_handlers/clientbound_packets/packet_writer.cjs')

/** 
 * @param {Socket} socket 
 * @param {number} classicID 
 * @param {number} alphaID 
 * @param {Position} position 
 * @param {Rotation} rotation 
 * @param {Position} estimatedPrevPosition 
 */
function MovePlayer(socket, classicID, alphaID, position, rotation, estimatedPrevPosition, playerName, heldItem, sneaking) {
    var posChange = {
        x: position.x - estimatedPrevPosition.x,
        y: position.y - estimatedPrevPosition.y,
        z: position.z - estimatedPrevPosition.z
    }
    
    var teleport = false
    var newEstimatedPosition = socket.thisPlayer.otherPlayers[alphaID].estimatedPosition = {
        x: estimatedPrevPosition.x + (Math.round(posChange.x * 32) / 32),
        y: estimatedPrevPosition.y + (Math.round(posChange.y * 32) / 32),
        z: estimatedPrevPosition.z + (Math.round(posChange.z * 32) / 32)
    }

    if (Math.abs(posChange.x) > 3.96875 || Math.abs(posChange.y) > 3.96875 || Math.abs(posChange.z) > 3.96875) {
        teleport = true
        newEstimatedPosition = {
            x: Math.floor(position.x * 32) / 32,
            y: Math.floor(position.y * 32) / 32,
            z: Math.floor(position.z * 32) / 32
        }
    }

    var prevRendered = socket.thisPlayer.otherPlayers[alphaID].rendered
    var distance = Math.pow(socket.thisPlayer.position.x - newEstimatedPosition.x, 2) + Math.pow(socket.thisPlayer.position.z - newEstimatedPosition.z, 2)

    if (distance >= 4096) {
        socket.thisPlayer.otherPlayers[alphaID].rendered = false
        if (prevRendered) packetWriter.Beta.Destroy_Entity(socket)(socket, alphaID)
    } else {
        socket.thisPlayer.otherPlayers[alphaID].estimatedPosition = newEstimatedPosition
        socket.thisPlayer.otherPlayers[alphaID].rendered = true
        if (!prevRendered) {
            packetWriter.Beta.Entity(socket)(socket, alphaID)
            packetWriter.Beta.Named_Entity_Spawn(socket)(socket, alphaID, playerName, position, rotation, heldItem)
        }
        if (!prevRendered || teleport) 
            packetWriter.Beta.Entity_Teleport(socket)(socket, alphaID, position, rotation)
        else
            packetWriter.Beta.Entity_Relative_Move(socket)(socket, alphaID, position, estimatedPrevPosition)
        
        if (sneaking) packetWriter.Beta.Animation(socket)(socket, alphaID, 104)
        else packetWriter.Beta.Animation(socket)(socket, alphaID, 105)
    }
}

module.exports = {MovePlayer}