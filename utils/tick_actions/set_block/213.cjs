const {Socket, World, Position} = require('../../../data_structures.cjs')
const dataWriter = require('../../../data_handlers/data_writer.cjs')
const packetWriter = require('../../../data_handlers/clientbound_packets/packet_writer.cjs')
const utils = require('../../utils.cjs')

/** 
 * @param {Socket} socket 
 */
function SetBlock(world, socket, position, blockID) {
    console.log(blockID)
    var blockID = utils.registry.block.GetBlockID(world, socket.thisPlayer.selectedRegistries.block, blockID)
    console.log(blockID)
    if (typeof(blockID) == "number") {
        packetWriter.Block_Change(socket)(world, socket, position, blockID, 0)
    }
    else {
        console.log(blockID.id)
        console.log(blockID.metadata)
        packetWriter.Block_Change(socket)(world, socket, position, blockID.id, blockID.metadata)
    }
}

module.exports = {SetBlock}