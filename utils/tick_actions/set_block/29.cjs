const {Socket, World, Position} = require('../../../data_structures.cjs')
const dataWriter = require('../../../data_handlers/data_writer.cjs')
const packetWriter = require('../../../data_handlers/clientbound_packets/packet_writer.cjs')
const utils = require('../../utils.cjs')

/** 
 * @param {Socket} socket 
 */
function SetBlock(world, socket, position, blockID) {
    var blockID = utils.registry.block.GetBlockID(world, socket.thisPlayer.selectedRegistries.block, blockID)
    packetWriter.Set_Block(socket)(socket, position, blockID)
}

/**
 * @param {World} world 
 * @param {Socket} socket 
 * @param {Position} position 
 * @param {number | string} blockID 
 */
function AddBlockUpdate(world, socket, position, blockID) {
    var blockIdentifier = blockID
    if (typeof(blockID) == "number") blockIdentifier = utils.registry.block.GetBlockName(world, socket.thisPlayer.selectedRegistries.block, blockID)

    var oldBlockUpdate = GetBlockUpdate(world, position)

    if (oldBlockUpdate == -1) {
        world.blockUpdates.push({
            x: position.x,
            y: position.y,
            z: position.z,
            id: blockIdentifier
        })
    } else world.blockUpdates[oldBlockUpdate].id = blockIdentifier
}

/**
 * @param {World} world 
 * @param {Position} position 
 */
function GetBlockUpdate(world, position) {
    for (var i = 0; i < world.blockUpdates.length; i++) {
        if (world.blockUpdates[i].x == position.x && world.blockUpdates[i].y == position.y && world.blockUpdates[i].z == position.z) return i
    }
    return -1
}

module.exports = {SetBlock, AddBlockUpdate, GetBlockUpdate}