const {Socket, World} = require('../../../data_structures.cjs')
const dataReader = require('../../data_reader.cjs')
const packetWriter = require('../../clientbound_packets/packet_writer.cjs')
const utils = require('../../../utils/utils.cjs')

var packetID = 13
var packetIdentifier = "Player Position And Look"

/** 
 * @param {World} world 
 * @param {Socket} socket 
 * @param {Buffer} data 
 */
function ReadPacket(world, socket, data) {
    var splitIndex = data.length - 42

    socket.log(`SERVERBOUND --> ${packetID} "${packetIdentifier}" / ${data.length} bytes`, false)
    
    if (splitIndex >= 0) {

        var position = {}
        position.x = dataReader.readDouble(socket, data, 1)
        position.y = dataReader.readDouble(socket, data, position.x.nextPos)
        position.stance = dataReader.readDouble(socket, data, position.y.nextPos)
        position.z = dataReader.readDouble(socket, data, position.stance.nextPos)
        var rotation = {}
        rotation.yaw = dataReader.readFloat(socket, data, position.z.nextPos)
        rotation.pitch = dataReader.readFloat(socket, data, rotation.yaw.nextPos)

        var onGround = dataReader.readBool(socket, data, rotation.pitch.nextPos)

        var newPosition = {x: position.x.value, y: position.y.value, z: position.z.value}
        var newRotation = {pitch: rotation.pitch.value, yaw: rotation.yaw.value}

        var sneaking = position.stance.value - position.y.value < 1.6        
        utils.player.set.Sneaking(world, socket.thisPlayer, sneaking)

        if (socket.disconnect == "" && !socket.thisPlayer.tick.teleportSelf && socket.thisPlayer.allowMovement) {
            if (position.y.value < 1) {
                socket.thisPlayer.tick.teleportSelf = true
            
                return splitIndex
            }

            utils.player.set.PositionAndRotation(world, socket.thisPlayer, newPosition, newRotation)
        }
    }

    return splitIndex
}

module.exports = {ReadPacket}