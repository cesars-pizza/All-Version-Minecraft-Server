const {Socket} = require('../../../data_structures')
const dataReader = require('../../data_reader')
const packetWriter = require('../../clientbound_packets/packet_writer')
const utils = require('../../../utils/utils')

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
            var difX = socket.thisPlayer.position.x != posX.value
            var difY = socket.thisPlayer.position.y != posY.value
            var difZ = socket.thisPlayer.position.z != posZ.value
            var difPitch = socket.thisPlayer.rotation.pitch != pitch.value
            var difYaw = socket.thisPlayer.rotation.yaw != yaw.value

            if (difX || difY || difZ) {
                socket.thisPlayer.tick.position = true
                utils.player.GetPlayer(world, socket, socket.thisPlayer.username).save = true
            }
            if (difPitch || difYaw) {
                socket.thisPlayer.tick.rotation = true
                utils.player.GetPlayer(world, socket, socket.thisPlayer.username).save = true
            }

            socket.thisPlayer.position = {x: posX.value, y: posY.value, z: posZ.value}
            socket.thisPlayer.rotation = {pitch: pitch.value, yaw: yaw.value}
        }
    }

    return splitIndex
}

module.exports = {ReadPacket}