const {Socket, World} = require('../../../data_structures.cjs')
const dataReader = require('../../data_reader.cjs')
const packetWriter = require('../../clientbound_packets/packet_writer.cjs')
const utils = require('../../../utils/utils.cjs')
const {HexViewBytes} = require('../../../server.cjs')

var packetID = 2
var packetIdentifier = "Handshake"

/** 
 * @param {World} world 
 * @param {Socket} socket 
 * @param {Buffer} data 
 */
function ReadPacket(world, socket, data) {
    var username = dataReader.readString(socket, data, 1)
        
    socket.log(`SERVERBOUND --> ${packetID} "${packetIdentifier}" / ${data.length} bytes`)
    
    if (username.value == undefined) return -999
    else {
        packetWriter.Beta.Handshake(socket)(world, socket, '-')
    }
    
    return data.length - (1 + username.length)
}

module.exports = {ReadPacket}