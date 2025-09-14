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
            var hasOpenInstance = utils.player.HasOpenInstance(world, Username.value)
            if (!hasOpenInstance) {
                var thisUPVN = socket.thisPlayer.upvn
                var thisUVNI = socket.thisPlayer.uvni
                socket.thisPlayer = utils.player.GetPlayer(world, socket, Username.value)
                socket.thisPlayer.upvn = thisUPVN
                socket.thisPlayer.uvni = thisUVNI
                socket.thisPlayer.selectedRegistries = {
                    block: utils.registry.block.GetBlockRegistry(world, socket.thisPlayer.uvni)
                }
                if (!socket.thisPlayer.verified) {
                    world.loadingPlayerNames[world.loadingPlayerNames.indexOf("")] = socket.thisPlayer.username

                    packetWriter.Server_Identification(socket)(socket, "Cool Server")
                    var blocks = utils.worldgen.GenerateClassicWorld(socket)(world, socket, 0, 0, [])
                    utils.world_packets(socket)(socket, blocks)
                    packetWriter.Spawn_Player(socket)(socket, -1, socket.thisPlayer.username, socket.thisPlayer.position, socket.thisPlayer.rotation)
                    for (var i = 0; i < world.loadedPlayers.length; i++) {
                        packetWriter.Spawn_Player(socket)(socket, world.loadedPlayers[i].classicID, world.loadedPlayers[i].username, world.loadedPlayers[i].position, world.loadedPlayers[i].rotation)
                    }

                    world.loadingPlayerNames.splice(world.loadingPlayerNames.indexOf(socket.thisPlayer.username))
                    world.loadedPlayers.push(socket.thisPlayer)

                    socket.thisPlayer.socket = socket
                    socket.thisPlayer.classicID = utils.player.GetClassicID(world, socket)
                    socket.thisPlayer.inWorld = true
                    socket.thisPlayer.tick = {spawn: true, position: false, rotation: false}
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