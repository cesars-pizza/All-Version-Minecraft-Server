const {Socket, World} = require('../../../data_structures.cjs')
const dataReader = require('../../data_reader.cjs')
const packetWriter = require('../../clientbound_packets/packet_writer.cjs')
const utils = require('../../../utils/utils.cjs')
const {HexViewBytes} = require('../../../server.cjs')
const fs = require('fs')

var packetID = 255
var packetIdentifier = "Disconnect"

/** 
 * @param {World} world 
 * @param {Socket} socket 
 * @param {Buffer} data 
 */
function ReadPacket(world, socket, data) {
    var packet = dataReader.readUByte(socket, data, 0)
    var reason = dataReader.readString(socket, data, packet.nextPos)
    
    socket.log(`SERVERBOUND --> ${packetID} "${packetIdentifier}" / ${data.length} bytes`)
    
    if (reason.value == undefined) return -999
    else {
        
        if (!socket.isClosed) {
            clearInterval(socket.keepAlive)
            socket.log("", false)
            socket.log(`Client Disconnect: ${reason.value}`);
            fs.writeFileSync(`./logs/log${socket.index.toString().padStart(5,'0')}.txt`, socket.logText)
            world.disconnectedPlayers.push({classicID: socket.thisPlayer.classicID, username: socket.thisPlayer.username})
            world.loadedPlayers.splice(world.loadedPlayers.map(player => player.username).indexOf(socket.thisPlayer.username), 1)
            socket.isClosed = true
        }

        socket.destroySoon()
        

        return data.length - (packet.length + reason.length)
    }
}

module.exports = {ReadPacket}