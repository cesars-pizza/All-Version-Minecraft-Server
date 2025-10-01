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

    if (splitIndex >= 0) {
        var position = {}
        position.x = dataReader.readDouble(socket, data, 1)
        position.y = dataReader.readDouble(socket, data, position.x.nextPos)
        position.stance = dataReader.readDouble(socket, data, position.y.nextPos)
        position.z = dataReader.readDouble(socket, data, position.stance.nextPos)
        
        var onGround = dataReader.readBool(socket, data, position.z.nextPos)

        socket.log(`Position: (${position.x.value}, ${position.y.value} => ${position.stance.value}, ${position.z.value})`)
        socket.log(`On Ground: ${onGround.value}`)

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

            if (socket.thisPlayer.settings.showPlotInfo) {
                var prevInBuild = socket.thisPlayer.position.x % 32 >= 16 && socket.thisPlayer.position.z % 32 >= 16
                var currInBuild = newPositionShifted.x % 32 >= 16 && newPositionShifted.z % 32 >= 16
                if (!prevInBuild && currInBuild) {
                    var build = utils.builds.GetBuild(socket)(world, Math.floor(newPositionShifted.x / 32), Math.floor(newPositionShifted.z / 32))
                    if (build != undefined && world.builds[build].creator != socket.thisPlayer.username) {
                        var buildInfo = utils.builds.GetBuildInfo(socket)(world, socket, Math.floor(newPositionShifted.x / 32), Math.floor(newPositionShifted.z / 32))
                        for (var i = 0; i < buildInfo.length; i++) {
                            packetWriter.Message(socket)(socket, 0, buildInfo[i])
                        }
                    }
                }
            }

            socket.thisPlayer.position = newPositionShifted
        }

        socket.log(`SERVERBOUND --> ${packetID} "${packetIdentifier}" / ${data.length} bytes`)
    }
    
    return splitIndex
}

module.exports = {ReadPacket}