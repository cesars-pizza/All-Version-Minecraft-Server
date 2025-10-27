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
function MovePlayer(socket, classicID, alphaID, position, rotation, estimatedPrevPosition) {  
    var posChange = {
        x: position.x - estimatedPrevPosition.x,
        y: position.y - estimatedPrevPosition.y,
        z: position.z - estimatedPrevPosition.z
    }
    
    socket.log(`Pos Change: (${posChange.x}, ${posChange.y}, ${posChange.z})`)
    socket.log(`Old Pos. Est.: (${estimatedPrevPosition.x}, ${estimatedPrevPosition.y}, ${estimatedPrevPosition.z})`)

    if (Math.abs(posChange.x) <= 3.96875 && Math.abs(posChange.y) <= 3.96875 && Math.abs(posChange.z) <= 3.96875) {
        packetWriter.Alpha.Entity_Look_and_Relative_Move(socket)(socket, alphaID, position, estimatedPrevPosition, rotation)
        socket.thisPlayer.otherPlayers[alphaID].estimatedPosition = {
            x: estimatedPrevPosition.x + (Math.round(posChange.x * 32) / 32),
            y: estimatedPrevPosition.y + (Math.round(posChange.y * 32) / 32),
            z: estimatedPrevPosition.z + (Math.round(posChange.z * 32) / 32)
        }
    }
    else {
        packetWriter.Alpha.Entity_Teleport(socket)(socket, alphaID, position, rotation)
        socket.thisPlayer.otherPlayers[alphaID].estimatedPosition = {
            x: Math.floor(position.x * 32) / 32,
            y: Math.floor(position.y * 32) / 32,
            z: Math.floor(position.z * 32) / 32
        }
    }

    socket.log(`New Pos. Est.: (${socket.thisPlayer.otherPlayers[alphaID].estimatedPosition.x}, ${socket.thisPlayer.otherPlayers[alphaID].estimatedPosition.y}, ${socket.thisPlayer.otherPlayers[alphaID].estimatedPosition.z})`)
}

module.exports = {MovePlayer}