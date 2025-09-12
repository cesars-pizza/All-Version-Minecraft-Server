const {Socket} = require('../../../data_structures')
const dataReader = require('../../data_reader')
const packetWriter = require('../../clientbound_packets/packet_writer')

var packetID = 0
var packetIdentifier = "Player Identification"

/** 
 * @param {Socket} socket 
 * @param {Buffer} data 
 */
function ReadPacket(socket, data) {
    var splitIndex = data.length - 65

    if (splitIndex >= 0) {
        var ID = dataReader.readUByte(socket, data, 0)
        var Username = dataReader.readString(socket, data, ID.nextPos)

        socket.log(`SERVERBOUND --> ${packetID} "${packetIdentifier}" / ${data.length} bytes`, false)
        socket.log(`Packet ID: ${ID.value}`)
        socket.log(`Username: ${Username.value}`)

        packetWriter.Server_Identification(socket)(socket, "Cool Server")
        packetWriter.Level_Initilize(socket)(socket)
        packetWriter.Level_Data_Chunk(socket)(socket, Array(64).fill(Array(256).fill(Array(256).fill(2))))
        packetWriter.Level_Finalize(socket)(socket, 256, 16, 256)
        //packetWriter.Spawn_Player(socket)(socket, -1, "LoompyDoompy", {x: 32, y: 5, z: 32}, {pitch: 0, yaw: 0})
        setTimeout(() => {
            packetWriter.Level_Initilize(socket)(socket)
            packetWriter.Level_Data_Chunk(socket)(socket, Array(64).fill(Array(256).fill(Array(256).fill(3))))
            packetWriter.Level_Finalize(socket)(socket, 256, 16, 256)
        }, 10000)
    }

    return splitIndex
}

module.exports = {ReadPacket}