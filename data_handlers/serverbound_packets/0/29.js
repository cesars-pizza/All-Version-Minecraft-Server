const {Socket, World} = require('../../../data_structures')
const dataReader = require('../../data_reader')
const packetWriter = require('../../clientbound_packets/packet_writer')
const utils = require('../../../utils/utils')
const { GetClassicID } = require('../../../utils/player')

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
                socket.thisPlayer = utils.player.GetPlayer(world, socket, Username.value)
                if (!socket.thisPlayer.verified) {
                    world.loadingPlayerNames[world.loadingPlayerNames.indexOf("")] = socket.thisPlayer.username

                    packetWriter.Server_Identification(socket)(socket, "Cool Server")
                    var blocks = Array(64).fill(Array(256).fill(Array(256).fill(2)), 0, 1)
                    blocks = blocks.fill(Array(256).fill(Array(256).fill(0)), 1)
                    utils.world_packets(socket)(socket, blocks)
                    packetWriter.Spawn_Player(socket)(socket, -1, socket.thisPlayer.username, socket.thisPlayer.position, socket.thisPlayer.rotation)

                    world.loadingPlayerNames.splice(world.loadingPlayerNames.indexOf(socket.thisPlayer.username))
                    world.loadedPlayers.push(socket.thisPlayer)

                    socket.thisPlayer.classicID = GetClassicID(world, socket)
                    socket.thisPlayer.inWorld = true
                    socket.thisPlayer.tick = {spawn: true, position: false, rotation: false}
                } else {
                    socket.setDisconnect("unverified")
                    utils.disconnect(socket)(socket)
                }
            } else {
                socket.setDisconnect("multipleInstances")
                utils.disconnect(socket)(socket)
            }
        }
    }

    return splitIndex
}

module.exports = {ReadPacket}