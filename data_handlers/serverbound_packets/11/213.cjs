const {Socket, World} = require('../../../data_structures.cjs')
const dataReader = require('../../data_reader.cjs')
const packetWriter = require('../../clientbound_packets/packet_writer.cjs')
const utils = require('../../../utils/utils.cjs')

var packetID = 11
var packetIdentifier = "Player Position"

/** 
 * @param {World} world 
 * @param {Socket} socket 
 * @param {Buffer} data 
 */
function ReadPacket(world, socket, data) {
    var splitIndex = data.length - 34

    socket.log(`SERVERBOUND --> ${packetID} "${packetIdentifier}" / ${data.length} bytes`, false)

    if (splitIndex >= 0) {
        var position = {}
        position.x = dataReader.readDouble(socket, data, 1)
        position.y = dataReader.readDouble(socket, data, position.x.nextPos)
        position.stance = dataReader.readDouble(socket, data, position.y.nextPos)
        position.z = dataReader.readDouble(socket, data, position.stance.nextPos)
        
        var onGround = dataReader.readBool(socket, data, position.z.nextPos)

        if (socket.disconnect == "" && !socket.thisPlayer.tick.teleportSelf && socket.thisPlayer.allowMovement) {
            var newPosition = {x: position.x.value, y: position.y.value, z: position.z.value}
            var newPositionShifted = newPosition

            if ((position.x.value == 8.5 && position.y.value == 65 && position.z.value == 8.5) || position.y.value < 1) {
                socket.thisPlayer.tick.teleportSelf = true
                return
            }

            var difX = socket.thisPlayer.position.x != newPositionShifted.x
            var difY = socket.thisPlayer.position.y != newPositionShifted.y
            var difZ = socket.thisPlayer.position.z != newPositionShifted.z
            
            if (difX || difY || difZ) {
                socket.thisPlayer.tick.position = true
                utils.player.GetPlayer(socket)(world, socket, socket.thisPlayer.username).save = true
            }

            if (difX || difZ) {
                var prevChunk = {x: Math.floor(socket.thisPlayer.position.x / 16), z: Math.floor(socket.thisPlayer.position.z / 16)}
                var newChunk = {x: Math.floor(newPositionShifted.x / 16), z: Math.floor(newPositionShifted.z / 16)}

                if (prevChunk.x != newChunk.x || prevChunk.z != newChunk.z) {
                    utils.world_packets.GenerateRenderDistance(socket)(world, socket, 10, newChunk.x, newChunk.z, prevChunk.x, prevChunk.z)
                }

                if (socket.thisPlayer.settings.showPlotInfo) {
                    var prevInBuild = utils.math.NegMod(socket.thisPlayer.position.x, 32) >= 16 && utils.math.NegMod(socket.thisPlayer.position.z, 32) >= 16
                    var currInBuild = utils.math.NegMod(newPositionShifted.x, 32) >= 16 && utils.math.NegMod(newPositionShifted.z, 32) >= 16
                    if (!prevInBuild && currInBuild) {
                        var build = utils.builds.GetBuild(socket)(world, Math.floor(newPositionShifted.x / 32), Math.floor(newPositionShifted.z / 32))
                        if (build != undefined && world.builds[build].creator != socket.thisPlayer.username) {
                            var buildInfo = utils.builds.GetBuildInfo(socket)(world, socket, Math.floor(newPositionShifted.x / 32), Math.floor(newPositionShifted.z / 32))
                            for (var i = 0; i < buildInfo.length; i++) {
                                packetWriter.Alpha.Chat_Message(socket)(world, socket, buildInfo[i])
                            }
                        }
                    }
                }
            }

            utils.player.PlayerCollisionFunctions(socket)(world, socket, newPositionShifted)

            socket.thisPlayer.position = newPositionShifted
        }
    }
    
    return splitIndex
}

module.exports = {ReadPacket}