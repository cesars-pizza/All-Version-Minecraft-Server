const {Socket, World, Position} = require('../../../data_structures.cjs')
const dataWriter = require('../../../data_handlers/data_writer.cjs')
const packetWriter = require('../../../data_handlers/clientbound_packets/packet_writer.cjs')
const utils = require('../../utils.cjs')

/** 
 * @param {Socket} socket 
 */
function SetBlock(world, socket, position, blockID) {
    var blockID = utils.registry.block.GetBlockID(world, socket.thisPlayer.selectedRegistries.block, blockID)
    packetWriter.Classic.Set_Block(socket)(socket, position, blockID)
}

/**
 * @param {World} world 
 * @param {Socket} socket 
 * @param {Position} position 
 * @param {number | string} blockID 
 * @param {boolean} doubleSet 
 */
function AddBlockUpdate(world, socket, position, blockID, doubleSet, prevBlockID) {
    var blockIdentifier = blockID
    if (typeof(blockID) == "number") blockIdentifier = utils.registry.block.GetBlockName(world, socket.thisPlayer.selectedRegistries.block, blockID)
    var prevBlockIdentifier = prevBlockID
    if (typeof(prevBlockID) == "number") prevBlockIdentifier = utils.registry.block.GetBlockName(world, socket.thisPlayer.selectedRegistries.block, prevBlockID)

    var blockName = blockIdentifier.split('[')[0]
    var prevBlockName = prevBlockIdentifier.split('[')[0]

    var oldBlockUpdate = GetBlockUpdate(world, position)

    if (oldBlockUpdate == -1) {
        world.blockUpdates.push({
            x: position.x,
            y: position.y,
            z: position.z,
            id: blockIdentifier,
            doubleSet: doubleSet
        })
    } else world.blockUpdates[oldBlockUpdate].id = blockIdentifier

    if (position.y > 1 && position.y < 64) {
        var neighbors = [
            {x: position.x, y: position.y, z: position.z},
            {x: position.x - 1, y: position.y, z: position.z},
            {x: position.x + 1, y: position.y, z: position.z},
            {x: position.x, y: position.y, z: position.z - 1},
            {x: position.x, y: position.y, z: position.z + 1},
            {x: position.x, y: position.y - 1, z: position.z},
            {x: position.x, y: position.y + 1, z: position.z},
        ]

        if (blockName == "redstone_wire" || prevBlockName == "redstone_wire") {
            neighbors.push({x: position.x - 1, y: position.y + 1, z: position.z})
            neighbors.push({x: position.x - 1, y: position.y - 1, z: position.z})
            neighbors.push({x: position.x + 1, y: position.y + 1, z: position.z})
            neighbors.push({x: position.x + 1, y: position.y - 1, z: position.z})
            neighbors.push({x: position.x, y: position.y + 1, z: position.z - 1})
            neighbors.push({x: position.x, y: position.y - 1, z: position.z - 1})
            neighbors.push({x: position.x, y: position.y + 1, z: position.z + 1})
            neighbors.push({x: position.x, y: position.y - 1, z: position.z + 1})
        }

        for (var i = 0; i < neighbors.length; i++) {
            if (utils.math.NegMod(neighbors[i].x, 32) >= 16 && utils.math.NegMod(neighbors[i].z, 32) >= 16 && neighbors[i].y > 1 && neighbors[i].y < 64)
                utils.tick_actions.set_block.SendPostPlacementUpdate(socket)(world, socket, neighbors[i], position, false)
        }
    }
}

function SendPostPlacementUpdate(world, socket, position, originPosition, wasScheduled) {

}

function SendNeighborChangedUpdate(world, socket, position, originPosition, wasScheduled) {

}

/**
 * @param {World} world 
 * @param {Socket} socket 
 * @param {Position} position 
 * @param {string | number} blockID 
 * @param {string | number} prevBlockID 
 * @param {number} priority 
 * @param {boolean} doubleSet 
 * @param {number} delay 
 */
function ScheduleBlockUpdate(world, socket, position, blockID, prevBlockID, priority, doubleSet, delay) {
    var buildIndex = utils.builds.GetBuild(socket)(world, Math.floor(position.x / 32), Math.floor(position.z / 32))

    if (typeof(blockID) == "number") blockID = utils.registry.block.GetBlockName(world, socket.thisPlayer.selectedRegistries.block, blockID)
    if (typeof(prevBlockID) == "number") prevBlockID = utils.registry.block.GetBlockName(world, socket.thisPlayer.selectedRegistries.block, prevBlockID)

    if (buildIndex != -1 && buildIndex != undefined) {
        world.builds[buildIndex].scheduledBlockUpdates.push({
            position: position,
            blockID: blockID,
            prevBlockID: prevBlockID,
            priority: priority,
            doubleSet: doubleSet,
            delay: delay
        })
    }
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

module.exports = {SetBlock, AddBlockUpdate, SendPostPlacementUpdate, SendNeighborChangedUpdate, ScheduleBlockUpdate, GetBlockUpdate}