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

            var difX = socket.thisPlayer.position.x != newPositionShifted.x
            var difY = socket.thisPlayer.position.y != newPositionShifted.y
            var difZ = socket.thisPlayer.position.z != newPositionShifted.z
            var difPitch = socket.thisPlayer.rotation.pitch != pitch.value
            var difYaw = socket.thisPlayer.rotation.yaw != yaw.value

            if (difX || difY || difZ) {
                socket.thisPlayer.tick.position = {
                    tick: true,
                    x: newPositionShifted.x - socket.thisPlayer.position.x,
                    y: newPositionShifted.y - socket.thisPlayer.position.y,
                    z: newPositionShifted.z - socket.thisPlayer.position.z
                }
                utils.player.GetPlayer(socket)(world, socket, socket.thisPlayer.username).save = true
            }
            if (difPitch || difYaw) {
                socket.thisPlayer.tick.rotation = true
                utils.player.GetPlayer(socket)(world, socket, socket.thisPlayer.username).save = true
            }

            if (socket.thisPlayer.settings.showPlotInfo) {
                var prevInBuild = utils.player.InBuildChunk(socket)(socket.thisPlayer.position)
                var currInBuild = utils.player.InBuildChunk(socket)(newPositionShifted)
                if (!prevInBuild && currInBuild) {
                    var build = utils.builds.GetBuild(socket)(world, Math.floor(newPositionShifted.x / 32), Math.floor(newPositionShifted.z / 32))
                    if (build != undefined && world.builds[build].creator != socket.thisPlayer.username) {
                        var buildInfo = utils.builds.GetBuildInfo(socket)(world, socket, Math.floor(newPositionShifted.x / 32), Math.floor(newPositionShifted.z / 32))
                        for (var i = 0; i < buildInfo.length; i++) {
                            packetWriter.Classic.Message(socket)(socket, 0, buildInfo[i])
                        }
                    }
                }
            }

            utils.player.PlayerCollisionFunctions(socket)(world, socket, newPositionShifted)

            socket.thisPlayer.position = newPositionShifted
            socket.thisPlayer.rotation = {pitch: pitch.value, yaw: yaw.value}
        }
    }
    
    return splitIndex
}

module.exports = {ReadPacket}