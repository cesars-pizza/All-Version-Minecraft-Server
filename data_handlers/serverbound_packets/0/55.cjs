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
    var splitIndex = data.length - 130

    if (splitIndex >= 0) {
        socket.log(`SERVERBOUND --> ${packetID} "${packetIdentifier}" / ${data.length} bytes`)

        var ID = dataReader.readUByte(socket, data, 0)
        var protocolVersion = dataReader.readUByte(socket, data, ID.nextPos)
        var username = dataReader.readString(socket, data, protocolVersion.nextPos)
        var verificationKey = dataReader.readString(socket, data, username.nextPos)
        var userType = dataReader.readUByte(socket, data, verificationKey.nextPos)

        if (socket.disconnect == "") {
            var hasOpenInstance = utils.player.HasOpenInstance(socket)(world, username.value)
            if (!hasOpenInstance) {
                var thisUPVN = socket.thisPlayer.upvn
                var thisUVNI = socket.thisPlayer.uvni
                socket.thisPlayer = utils.player.GetPlayer(socket)(world, socket, username.value)
                socket.thisPlayer.upvn = thisUPVN
                socket.thisPlayer.uvni = thisUVNI
                socket.thisPlayer.selectedRegistries = {
                    block: utils.registry.block.GetBlockRegistry(world, socket.thisPlayer.uvni)
                }
                if (socket.thisPlayer.position.x % 32 >= 16 && socket.thisPlayer.position.z % 32 >= 16) socket.thisPlayer.position = {
                    x: Math.floor(socket.thisPlayer.position.x / 16) * 16 - 0.5,
                    y: 2,
                    z: Math.floor(socket.thisPlayer.position.z / 16) * 16 - 0.5,
                }
                if (!socket.thisPlayer.verified) {
                    world.loadingPlayerNames[world.loadingPlayerNames.indexOf("")] = socket.thisPlayer.username

                    packetWriter.Server_Identification(socket)(world, socket, world.config.serverName, world.config.serverStatus, true)
                    var blocks = utils.worldgen.GenerateClassicWorld(socket)(world, socket, socket.thisPlayer.classicWorldOffset.x, socket.thisPlayer.classicWorldOffset.z)
                    utils.world_packets(socket)(socket, blocks)
                    packetWriter.Spawn_Player(socket)(socket, -1, socket.thisPlayer.username, socket.thisPlayer.position, socket.thisPlayer.rotation)
                    for (var i = 0; i < world.loadedPlayers.length; i++) {
                        packetWriter.Spawn_Player(socket)(socket, world.loadedPlayers[i].classicID, world.loadedPlayers[i].username, world.loadedPlayers[i].position, world.loadedPlayers[i].rotation)
                    }

                    world.loadingPlayerNames.splice(world.loadingPlayerNames.indexOf(socket.thisPlayer.username))
                    world.loadedPlayers.push(socket.thisPlayer)

                    socket.thisPlayer.socket = socket
                    socket.thisPlayer.classicID = utils.player.GetClassicID(socket)(world, socket)
                    socket.thisPlayer.inWorld = true
                    socket.thisPlayer.tick = {spawn: true, position: false, rotation: false, messages: [], systemMessages: [], errorMessages: [], teleportSelf: false, teleportOthers: false}
                } else {
                    socket.setDisconnect("unverified")
                    utils.disconnect(socket)(world, socket)
                }
            } else {
                socket.setDisconnect("multipleInstances")
                socket.thisPlayer.username = username.value
                utils.disconnect(socket)(world, socket)
            }
        } else utils.disconnect(socket)(world, socket)

    }
    
    return splitIndex
}

module.exports = {ReadPacket}