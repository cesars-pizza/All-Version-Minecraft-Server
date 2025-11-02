const {Socket, World} = require('../../../data_structures.cjs')
const dataReader = require('../../data_reader.cjs')
const packetWriter = require('../../clientbound_packets/packet_writer.cjs')
const utils = require('../../../utils/utils.cjs')

var packetID = 8
var packetIdentifier = "Position and Orientation"

/** 
 * @param {World} world 
 * @param {Socket} socket 
 * @param {Buffer} data 
 */
function ReadPacket(world, socket, data) {
    var splitIndex = data.length - 10

    if (splitIndex >= 0) {
        socket.log(`SERVERBOUND --> ${packetID} "${packetIdentifier}" / ${data.length} bytes`, false)

        var id = dataReader.readUByte(socket, data, 0)
        var playerID = dataReader.readByte(socket, data, id.nextPos)
        var posX = dataReader.readFixed5Short(socket, data, playerID.nextPos)
        var posY = dataReader.readFixed5Short(socket, data, posX.nextPos)
        var posZ = dataReader.readFixed5Short(socket, data, posY.nextPos)
        var yaw = dataReader.readUByte(socket, data, posZ.nextPos)
        var pitch = dataReader.readUByte(socket, data, yaw.nextPos)

        if (socket.disconnect == "" && !socket.thisPlayer.tick.teleportSelf) {
            var newPosition = {x: posX.value + 256 * socket.thisPlayer.classicWorldOffset.x, y: posY.value, z: posZ.value + 256 * socket.thisPlayer.classicWorldOffset.z}
            var newPositionShifted = {x: newPosition.x + 0.015625, y: newPosition.y - 1.59275, z: newPosition.z + 0.015625}
            var newRotation = {pitch: (pitch.value / 255) * 360, yaw: ((yaw.value / 255) * 360) - 180}

            utils.player.set.PositionAndRotation(world, socket.thisPlayer, newPositionShifted, newRotation)
        }
    }
    
    return splitIndex
}

module.exports = {ReadPacket}