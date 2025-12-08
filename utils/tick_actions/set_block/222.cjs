const {Socket, World, Position} = require('../../../data_structures.cjs')
const dataWriter = require('../../../data_handlers/data_writer.cjs')
const packetWriter = require('../../../data_handlers/clientbound_packets/packet_writer.cjs')
const utils = require('../../utils.cjs')

/** 
 * @param {Socket} socket 
 */
function SetBlockEntity(world, socket, position, data) {
    packetWriter.Alpha.Complex_Entities(socket)(world, socket, position, data)
}

module.exports = {SetBlockEntity}