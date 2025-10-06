const {Socket, World, Position} = require('../../../data_structures.cjs')
const dataWriter = require('../../../data_handlers/data_writer.cjs')
const packetWriter = require('../../../data_handlers/clientbound_packets/packet_writer.cjs')
const utils = require('../../utils.cjs')

/** 
 * @param {Socket} socket 
 */
function SetBlock(world, socket, position, blockID) {
    var blockID = utils.registry.block.GetBlockID(world, socket.thisPlayer.selectedRegistries.block, blockID)
    if (typeof(blockID) == "number") {
        packetWriter.Multi_Block_Change(socket)(world, socket, {x: position.x + 2, y: position.y + 2, z: position.z + 2}, blockID, 0)
        //packetWriter.Multi_Block_Change(socket)(world, socket, {x: position.x + 2, y: position.y + 2, z: position.z + 2}, blockID, 0)
        //packetWriter.Block_Change(socket)(world, socket, position, blockID, 0)
        //packetWriter.Block_Change(socket)(world, socket, position, blockID, 0)
        //packetWriter.Block_Change(socket)(world, socket, {x: position.x, y: position.y + 5, z: position.z}, blockID, 12)
    }
    else {
        packetWriter.Block_Change(socket)(world, socket, position, blockID.id, blockID.metadata)
        packetWriter.Block_Change(socket)(world, socket, position, blockID.id, blockID.metadata)
    }
}

module.exports = {SetBlock}