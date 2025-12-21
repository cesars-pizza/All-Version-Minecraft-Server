const {Socket, Position} = require('../../../../data_structures.cjs')
const utils = require('../../../../utils/utils.cjs')
const dataWriter = require('../../../data_writer.cjs')
const fs = require('fs')

var packetID = 130
var packetIdentifier = "Update Sign"

/** 
 * @param {Socket} socket 
 * @param {Position} position 
 * @param {[]} data 
 */
function WritePacket(world, socket, position, data) {
    var processedData = utils.blockEntity.ConvertToVersionSpecificData(world, socket, data)
    
    socket.writePacket(packetID, packetIdentifier, processedData)
}

module.exports = {WritePacket}