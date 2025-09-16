const {Socket} = require('../../../data_structures.cjs')
const dataReader = require('../../data_reader.cjs')
const packetWriter = require('../../clientbound_packets/packet_writer.cjs')
const utils = require('../../../utils/utils.cjs')

var packetID = 8
var packetIdentifier = "Position and Orientation"

/** 
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

        if (socket.disconnect == "") {
            var difX = socket.thisPlayer.position.x != (posX.value + 0.015625)
            var difY = socket.thisPlayer.position.y != (posY.value - 1.59375)
            var difZ = socket.thisPlayer.position.z != (posZ.value + 0.015625)
            var difPitch = socket.thisPlayer.rotation.pitch != pitch.value
            var difYaw = socket.thisPlayer.rotation.yaw != yaw.value

            if (difX || difY || difZ) {
                socket.thisPlayer.tick.position = true
                utils.player.GetPlayer(socket)(world, socket, socket.thisPlayer.username).save = true
            }
            if (difPitch || difYaw) {
                socket.thisPlayer.tick.rotation = true
                utils.player.GetPlayer(socket)(world, socket, socket.thisPlayer.username).save = true
            }

            socket.thisPlayer.position = {x: posX.value + 0.015625, y: posY.value - 1.59375, z: posZ.value + 0.015625}
            socket.thisPlayer.rotation = {pitch: pitch.value, yaw: yaw.value}
        }
    }
    
    return splitIndex
}

module.exports = {ReadPacket}