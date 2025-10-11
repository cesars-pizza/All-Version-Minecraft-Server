const {Socket, World} = require('../../../data_structures.cjs')
const dataReader = require('../../data_reader.cjs')
const packetWriter = require('../../clientbound_packets/packet_writer.cjs')
const utils = require('../../../utils/utils.cjs')
const {HexViewBytes} = require('../../../server.cjs')

var packetID = 1
var packetIdentifier = "Login Request"

/** 
 * @param {World} world 
 * @param {Socket} socket 
 * @param {Buffer} data 
 */
function ReadPacket(world, socket, data) {
    var packet = dataReader.readUByte(socket, data, 0)
    var protocolVersion = dataReader.readInt(socket, data, packet.nextPos)
    var username = dataReader.readString(socket, data, protocolVersion.nextPos)
    var password = dataReader.readString(socket, data, username.nextPos)
    
    socket.log(`SERVERBOUND --> ${packetID} "${packetIdentifier}" / ${data.length} bytes`)
    
    if (isNaN(protocolVersion.value) || username.value == undefined || password.value == undefined) return -999
    else {
        if (socket.disconnect == "") {
            var hasOpenInstance = utils.player.HasOpenInstance(socket)(world, username.value)
            if (!hasOpenInstance) {
                var thisUPVN = socket.thisPlayer.upvn
                var thisUVNI = socket.thisPlayer.uvni
                socket.thisPlayer = utils.player.GetPlayer(socket)(world, socket, username.value)
                socket.thisPlayer.socket = socket
                socket.thisPlayer.classicID = utils.player.GetClassicID(socket)(world, socket)
                socket.thisPlayer.alphaID = utils.player.GetAlphaID(socket)(world, socket)
                socket.thisPlayer.allowMovement = false
                socket.thisPlayer.upvn = thisUPVN
                socket.thisPlayer.uvni = thisUVNI
                socket.thisPlayer.selectedRegistries = {
                    block: utils.registry.block.GetBlockRegistry(world, socket.thisPlayer.uvni),
                    item: utils.registry.item.GetItemRegistry(world, socket.thisPlayer.uvni)
                }
                socket.thisPlayer.floorChangeCooldown = 0
                socket.thisPlayer.joinCount++

                if (socket.thisPlayer.position.x % 32 >= 16 && socket.thisPlayer.position.z % 32 >= 16) socket.thisPlayer.position = {
                    x: Math.floor(socket.thisPlayer.position.x / 16) * 16 - 0.5,
                    y: 2,
                    z: Math.floor(socket.thisPlayer.position.z / 16) * 16 - 0.5,
                }
                if (!socket.thisPlayer.verified) {
                    world.loadingPlayerNames[world.loadingPlayerNames.indexOf("")] = socket.thisPlayer.username
                    
                    packetWriter.Login_Response(socket)(world, socket, socket.thisPlayer.alphaID, world.config.serverName, world.config.serverStatus, 0, 0)
                    utils.world_packets.GenerateRenderDistance(socket)(world, socket, 10, Math.floor(socket.thisPlayer.position.x / 16), Math.floor(socket.thisPlayer.position.z / 16), undefined, undefined)
                    socket.thisPlayer.tick = {spawn: true, position: false, rotation: false, messages: [], systemMessages: [], errorMessages: [], teleportSelf: false, teleportOthers: false}
                    world.loadingPlayerNames.splice(world.loadingPlayerNames.indexOf(socket.thisPlayer.username))
                    world.loadedPlayers.push(socket.thisPlayer)

                    socket.thisPlayer.inWorld = true
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

        return data.length - (packet.length + protocolVersion.length + username.length + password.length)
    }
}

module.exports = {ReadPacket}