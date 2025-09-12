const {Socket} = require('../../../data_structures')
const dataReader = require('../../data_reader')
const packetWriter = require('../../clientbound_packets/packet_writer')
const utils = require('../../../utils/utils')

var packetID = 0
var packetIdentifier = "Player Identification"

/** 
 * @param {Socket} socket 
 * @param {Buffer} data 
 */
function ReadPacket(socket, data) {
    var splitIndex = data.length - 65

    if (splitIndex >= 0) {
        socket.log(`SERVERBOUND --> ${packetID} "${packetIdentifier}" / ${data.length} bytes`, false)

        var ID = dataReader.readUByte(socket, data, 0)
        var Username = dataReader.readString(socket, data, ID.nextPos)

        packetWriter.Server_Identification(socket)(socket, "Cool Server")
        utils.worldgen(socket)(socket, Array(64).fill(Array(256).fill(Array(256).fill(2))))
        packetWriter.Spawn_Player(socket)(socket, -1, Username.value, {x: 32, y: 65, z: 32}, {pitch: 0, yaw: 0})
    }

    return splitIndex
}

module.exports = {ReadPacket}