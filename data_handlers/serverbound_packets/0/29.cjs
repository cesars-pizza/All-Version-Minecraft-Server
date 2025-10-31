const {Socket, World} = require('../../../data_structures.cjs')
const dataReader = require('../../data_reader.cjs')
const packetWriter = require('../../clientbound_packets/packet_writer.cjs')
const utils = require('../../../utils/utils.cjs')

var packetID = 0
var packetIdentifier = "Player Identification"

/** 
 * @param {World} world 
 * @param {Socket} socket 
 * @param {Buffer} data 
 */
function ReadPacket(world, socket, data) {
    var splitIndex = data.length - 65

    if (splitIndex >= 0) {
        socket.log(`SERVERBOUND --> ${packetID} "${packetIdentifier}" / ${data.length} bytes`)

        var ID = dataReader.readUByte(socket, data, 0)
        var Username = dataReader.readString(socket, data, ID.nextPos)

        if (socket.disconnect == "") {
            var hasOpenInstance = utils.player.HasOpenInstance(socket)(world, Username.value)
            if (!hasOpenInstance) {
                socket.thisPlayer = utils.player.InitializePlayer(world, socket.thisPlayer, socket, Username.value)

                if (!socket.thisPlayer.verified) {
                    world.loadingPlayerNames[world.loadingPlayerNames.indexOf("")] = socket.thisPlayer.username

                    packetWriter.Classic.Server_Identification(socket)(world, socket, world.config.serverName)
                    var blocks = utils.worldgen.GenerateClassicWorld(socket)(world, socket, socket.thisPlayer.classicWorldOffset.x, socket.thisPlayer.classicWorldOffset.z)
                    utils.world_packets.GenerateBlocks(socket)(socket, blocks)
                    packetWriter.Classic.Spawn_Player(socket)(socket, -1, socket.thisPlayer.username, socket.thisPlayer.position, socket.thisPlayer.rotation)
                    
                    for (var i = 0; i < world.loadedPlayers.length; i++) {
                        socket.thisPlayer.otherPlayers[world.loadedPlayers[i].alphaID] = {}
                        packetWriter.Classic.Spawn_Player(socket)(socket, world.loadedPlayers[i].classicID, world.loadedPlayers[i].username, world.loadedPlayers[i].position, world.loadedPlayers[i].rotation)
                    }

                    world.loadingPlayerNames.splice(world.loadingPlayerNames.indexOf(socket.thisPlayer.username))
                    world.loadedPlayers.push(socket.thisPlayer)

                    socket.thisPlayer.inWorld = true
                } else {
                    socket.setDisconnect("unverified")
                    utils.disconnect(socket)(world, socket)
                }
            } else {
                socket.setDisconnect("multipleInstances")
                utils.disconnect(socket)(world, socket)
            }
        } else utils.disconnect(socket)(world, socket)

    }
    
    return splitIndex
}

module.exports = {ReadPacket}