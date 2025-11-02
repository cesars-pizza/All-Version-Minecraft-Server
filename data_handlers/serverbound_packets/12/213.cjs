const {Socket, World} = require('../../../data_structures.cjs')
const dataReader = require('../../data_reader.cjs')
const packetWriter = require('../../clientbound_packets/packet_writer.cjs')
const utils = require('../../../utils/utils.cjs')

var packetID = 12
var packetIdentifier = "Player Look"

/** 
 * @param {World} world 
 * @param {Socket} socket 
 * @param {Buffer} data 
 */
function ReadPacket(world, socket, data) {
    var splitIndex = data.length - 10

    socket.log(`SERVERBOUND --> ${packetID} "${packetIdentifier}" / ${data.length} bytes`, false)

    if (splitIndex >= 0) {
        var rotation = {}
        rotation.yaw = dataReader.readFloat(socket, data, 1)
        rotation.pitch = dataReader.readFloat(socket, data, rotation.yaw.nextPos)

        var onGround = dataReader.readBool(socket, data, rotation.pitch.nextPos)

        if (socket.disconnect == "" && !socket.thisPlayer.tick.teleportSelf && socket.thisPlayer.allowMovement) {
            var rawRotation = {pitch: rotation.pitch.value, yaw: rotation.yaw.value}
            utils.player.set.Rotation(world, socket.thisPlayer, rawRotation)
        }
    }
    
    return splitIndex
}

module.exports = {ReadPacket}