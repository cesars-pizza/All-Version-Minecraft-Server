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
    var mapSeed = dataReader.readLong(socket, data, password.nextPos)
    var dimension = dataReader.readByte(socket, data, mapSeed.nextPos)
    
    socket.log(`SERVERBOUND --> ${packetID} "${packetIdentifier}" / ${data.length} bytes`)
    
    if (isNaN(protocolVersion.value) || username.value == undefined || password.value == undefined || mapSeed.value == undefined || isNaN(dimension.value)) return -999
    else {
        if (socket.disconnect == "") {
            var hasOpenInstance = utils.player.HasOpenInstance(world, username.value)
            if (!hasOpenInstance) {
                socket.thisPlayer = utils.player.InitializePlayer(world, socket.thisPlayer, socket, username.value)

                if (!socket.thisPlayer.verified) {
                    world.loadingPlayerNames[world.loadingPlayerNames.indexOf("")] = socket.thisPlayer.username
                    
                    packetWriter.Alpha.Login_Response(socket)(world, socket, socket.thisPlayer.alphaID, world.config.serverName, world.config.serverStatus, 0, 0)
                    utils.world_packets.GenerateRenderDistance(socket)(world, socket, world.config.renderDistance.default, Math.floor(socket.thisPlayer.position.x / 16), Math.floor(socket.thisPlayer.position.z / 16), undefined, undefined)
                    
                    for (var i = 0; i < world.loadedPlayers.length; i++) {
                        socket.thisPlayer.otherPlayers[world.loadedPlayers[i].alphaID] = {
                            rendered: true,
                            estimatedPosition: {
                                x: Math.floor(world.loadedPlayers[i].position.x * 32) / 32,
                                y: Math.floor(world.loadedPlayers[i].position.x * 32) / 32,
                                z: Math.floor(world.loadedPlayers[i].position.x * 32) / 32
                            }
                        }
                        packetWriter.Alpha.Named_Entity_Spawn(socket)(socket, world.loadedPlayers[i].alphaID, world.loadedPlayers[i].username, world.loadedPlayers[i].position, world.loadedPlayers[i].rotation, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, world.loadedPlayers[i].inventory.held_item))
                    }

                    packetWriter.Alpha.Player_Inventory(socket)(world, socket, -1, socket.thisPlayer.inventory.slots)
                    socket.thisPlayer.inventory.held_item = socket.thisPlayer.inventory.slots.hotbar[0].id

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