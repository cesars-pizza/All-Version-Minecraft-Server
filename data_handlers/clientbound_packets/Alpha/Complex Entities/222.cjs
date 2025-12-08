const {Socket, Position} = require('../../../../data_structures.cjs')
const utils = require('../../../../utils/utils.cjs')
const dataWriter = require('../../../data_writer.cjs')
const fs = require('fs')

var packetID = 59
var packetIdentifier = "Complex Entities"

/** 
 * @param {Socket} socket 
 * @param {Position} position 
 * @param {[]} data 
 */
function WritePacket(world, socket, position, data) {
    var processedData = dataWriter.writeGZip(socket, dataWriter.writeNBT.WriteNBT(socket, "", utils.blockEntity.ConvertToVersionSpecificData(world, socket, data)))
    
    socket.writePacket(packetID, packetIdentifier, dataWriter.writeInt(socket, position.x).concat(
        dataWriter.writeShort(socket, position.y),
        dataWriter.writeInt(socket, position.z),
        dataWriter.writeShort(socket, processedData.length),
        processedData
    ))
}

module.exports = {WritePacket}