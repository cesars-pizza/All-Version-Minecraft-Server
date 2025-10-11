const {Socket, World} = require('../../../data_structures.cjs')
const dataReader = require('../../data_reader.cjs')
const packetWriter = require('../../clientbound_packets/packet_writer.cjs')
const utils = require('../../../utils/utils.cjs')

var packetID = 3
var packetIdentifier = "Chat Message"

/** 
 * @param {World} world 
 * @param {Socket} socket 
 * @param {Buffer} data 
 */
function ReadPacket(world, socket, data) {
    var message = dataReader.readString(socket, data, 1)
    
    socket.log(`SERVERBOUND --> ${packetID} "${packetIdentifier}" / ${data.length} bytes`, false)
    
    if (message.value == undefined) return -999
    else {

        if (socket.disconnect == "") {
            if (message.value == "give") packetWriter.Add_To_Inventory(socket)(world, socket, 1, 64, 0)
            else if (message.value == "pos") packetWriter.Chat_Message(socket)(world, socket, `(${socket.thisPlayer.position.x}, ${socket.thisPlayer.position.y}, ${socket.thisPlayer.position.z}) facing (${utils.math.NegMod(socket.thisPlayer.rotation.pitch, 360)}, ${utils.math.NegMod(socket.thisPlayer.rotation.yaw, 360)})`)
        }

        return data.length - (1 + message.length)
    }
}

module.exports = {ReadPacket}