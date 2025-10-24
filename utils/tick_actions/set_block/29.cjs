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
function AddBlockUpdate(world, socket, position, blockID, doubleSet, prevBlockID, scheduled) {
    console.log(`Block update at (${position.x}, ${position.y}, ${position.z}) / ${prevBlockID} -> ${blockID}`)

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

        if (scheduled) {
            if (blockName.includes('water') || prevBlockName.includes('water') || blockName.includes('lava') || prevBlockName.includes('lava')) {            
                var neighborBlocks = [
                    utils.worldgen.GetBlock({thisPlayer:{upvn:-1}})(world, {}, {x: position.x, y: position.y - 1, z: position.z}),
                    utils.worldgen.GetBlock({thisPlayer:{upvn:-1}})(world, {}, {x: position.x, y: position.y + 1, z: position.z}),
                    utils.worldgen.GetBlock({thisPlayer:{upvn:-1}})(world, {}, {x: position.x, y: position.y, z: position.z - 1}),
                    utils.worldgen.GetBlock({thisPlayer:{upvn:-1}})(world, {}, {x: position.x, y: position.y, z: position.z + 1}),
                    utils.worldgen.GetBlock({thisPlayer:{upvn:-1}})(world, {}, {x: position.x - 1, y: position.y, z: position.z}),
                    utils.worldgen.GetBlock({thisPlayer:{upvn:-1}})(world, {}, {x: position.x + 1, y: position.y, z: position.z})
                ]
                var verifyLiquid = LiquidVerifier(world, neighborBlocks, prevBlockIdentifier, position, (blockName.includes('water') || prevBlockName.includes('water')) ? "water" : "lava")
                if (!verifyLiquid.update) {
                    world.blockUpdates.pop()
                    return false
                }
                else {
                    if (verifyLiquid.height == 0) blockID = "air"
                    else if (verifyLiquid.height == 8) blockID = `flowing_${verifyLiquid.toBeFluid}[height=7,falling=true]`
                    else blockID = `flowing_${verifyLiquid.toBeFluid}[height=${verifyLiquid.height},falling=false]`
                }
            }
        }

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
                utils.tick_actions.set_block.SendPostPlacementUpdate(socket)(world, socket, neighbors[i], position, blockName)
        }
    }

    return true
}

/**
 * @param {World} world 
 * @param {Socket} socket 
 * @param {Position} position 
 * @param {Position} originPosition 
 * @param {string} blockName 
 */
function SendPostPlacementUpdate(world, socket, position, originPosition, blockName) {
    var updatedBuildIndex = utils.builds.GetBuild({})(world, Math.floor(position.x / 32), Math.floor(position.z / 32))
    if (!world.builds[updatedBuildIndex].settings.blockUpdates) return

    if (!world.builds[updatedBuildIndex].settings.liquidUpdates) return

    var thisBlock = utils.worldgen.GetBlock({thisPlayer: {upvn: -1}})(world, {}, position)

    var neighbors = [
        utils.worldgen.GetBlock({thisPlayer:{upvn:-1}})(world, {}, {x: position.x, y: position.y - 1, z: position.z}),
        utils.worldgen.GetBlock({thisPlayer:{upvn:-1}})(world, {}, {x: position.x, y: position.y + 1, z: position.z}),
        utils.worldgen.GetBlock({thisPlayer:{upvn:-1}})(world, {}, {x: position.x, y: position.y, z: position.z - 1}),
        utils.worldgen.GetBlock({thisPlayer:{upvn:-1}})(world, {}, {x: position.x, y: position.y, z: position.z + 1}),
        utils.worldgen.GetBlock({thisPlayer:{upvn:-1}})(world, {}, {x: position.x - 1, y: position.y, z: position.z}),
        utils.worldgen.GetBlock({thisPlayer:{upvn:-1}})(world, {}, {x: position.x + 1, y: position.y, z: position.z})
    ]

    if (thisBlock == "air" || thisBlock.includes("water") || thisBlock.includes("lava")) {
        LiquidTests(world, neighbors, thisBlock, position)
    }
}

function SendNeighborChangedUpdate(world, socket, position, originPosition, blockName) {

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
    if (blockID == prevBlockID) return

    console.log(`Scheduled block update from ${prevBlockID} to ${blockID} at (${position.x}, ${position.y}, ${position.z}) in ${delay} ticks`)

    var buildIndex = utils.builds.GetBuild(socket)(world, Math.floor(position.x / 32), Math.floor(position.z / 32))

    if (typeof(blockID) == "number") blockID = utils.registry.block.GetBlockName(world, socket.thisPlayer.selectedRegistries.block, blockID)
    if (typeof(prevBlockID) == "number") prevBlockID = utils.registry.block.GetBlockName(world, socket.thisPlayer.selectedRegistries.block, prevBlockID)

    if (buildIndex != -1 && buildIndex != undefined) {
        for (var i = 0; i < world.builds[buildIndex].scheduledBlockUpdates.length; i++) {
            if (position.x == world.builds[buildIndex].scheduledBlockUpdates[i].position.x && position.y == world.builds[buildIndex].scheduledBlockUpdates[i].position.y && position.z == world.builds[buildIndex].scheduledBlockUpdates[i].position.z && world.builds[buildIndex].scheduledBlockUpdates[i].delay != 0) {console.log("Cancelled"); return}
        }

        world.builds[buildIndex].scheduledBlockUpdates.push({
            position: position,
            blockID: blockID,
            prevBlockID: prevBlockID,
            priority: priority,
            doubleSet: doubleSet,
            delay: delay,
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

function LiquidHorizontalFlowTest(neighbor, belowNeighbor, toBeFluid) {    
    var height = 0
    
    var neighborFluid = neighbor.includes('water') ? "water" : (neighbor.includes('lava') ? "lava" : "none")
    if (neighborFluid != "none" && (toBeFluid == "none" || toBeFluid == neighborFluid || neighborFluid == "water")) {
        if (!neighbor.includes("flowing")) {
            toBeFluid = neighborFluid
            height = 8
        } else if (belowNeighbor != "air" && !belowNeighbor.includes(neighborFluid)) {
            var neighborHeight = 8
                if (neighbor.includes("level=7")) neighborHeight = 7
            else if (neighbor.includes("level=6")) neighborHeight = 6
            else if (neighbor.includes("level=5")) neighborHeight = 5
            else if (neighbor.includes("level=4")) neighborHeight = 4
            else if (neighbor.includes("level=3")) neighborHeight = 3
            else if (neighbor.includes("level=2")) neighborHeight = 2
            else if (neighbor.includes("level=1")) neighborHeight = 1

            toBeFluid = neighborFluid
            height = neighborHeight
        }
    }

    return {
        toBeFluid: toBeFluid,
        height: height
    }
}

function LiquidHorizontalDrainTest(neighbor, toBeFluid) {    
    var height = 0
    
    var neighborFluid = neighbor.includes('water') ? "water" : (neighbor.includes('lava') ? "lava" : "none")
    if (toBeFluid == neighborFluid) {
        if (!neighbor.includes("flowing")) {
            toBeFluid = neighborFluid
            height = 8
        } else {
            var neighborHeight = 8
                if (neighbor.includes("level=7")) neighborHeight = 7
            else if (neighbor.includes("level=6")) neighborHeight = 6
            else if (neighbor.includes("level=5")) neighborHeight = 5
            else if (neighbor.includes("level=4")) neighborHeight = 4
            else if (neighbor.includes("level=3")) neighborHeight = 3
            else if (neighbor.includes("level=2")) neighborHeight = 2
            else if (neighbor.includes("level=1")) neighborHeight = 1

            toBeFluid = neighborFluid
            height = neighborHeight
        }
    }

    return {
        toBeFluid: toBeFluid,
        height: height
    }
}

function LiquidTests(world, neighbors, thisBlock, position) {
    neighbors.push(
        utils.worldgen.GetBlock({thisPlayer:{upvn:-1}})(world, {}, {x: position.x, y: position.y - 1, z: position.z - 1}),
        utils.worldgen.GetBlock({thisPlayer:{upvn:-1}})(world, {}, {x: position.x, y: position.y - 1, z: position.z + 1}),
        utils.worldgen.GetBlock({thisPlayer:{upvn:-1}})(world, {}, {x: position.x - 1, y: position.y - 1, z: position.z}),
        utils.worldgen.GetBlock({thisPlayer:{upvn:-1}})(world, {}, {x: position.x + 1, y: position.y - 1, z: position.z})
    )

    var currentHeight = 9
    if (thisBlock == "air") currentHeight = 0
    else if (thisBlock.includes("falling=true")) currentHeight = 8
    else if (thisBlock.includes("level=7")) currentHeight = 7
    else if (thisBlock.includes("level=6")) currentHeight = 6
    else if (thisBlock.includes("level=5")) currentHeight = 5
    else if (thisBlock.includes("level=4")) currentHeight = 4
    else if (thisBlock.includes("level=3")) currentHeight = 3
    else if (thisBlock.includes("level=2")) currentHeight = 2
    else if (thisBlock.includes("level=1")) currentHeight = 1

    var flowDelay = 5
    var height = 0
    var toBeFluid = "none"
    var falling = false

    var thisFluid = thisBlock.includes('water') ? "water" : (thisBlock.includes('lava') ? "lava" : "none")

    // Test flowing down
    var testingFluid = neighbors[1].includes('water') ? "water" : (neighbors[1].includes('lava') ? "lava" : "none")
    if (testingFluid != "none" && (thisFluid == "none" || thisFluid == testingFluid)) {
        toBeFluid = testingFluid
        height = 8
        falling = true
    } else {
        if (thisBlock == "air") {
            var flowTest1 = LiquidHorizontalFlowTest(neighbors[4], neighbors[8], toBeFluid)
            var flowTest2 = LiquidHorizontalFlowTest(neighbors[5], neighbors[9], flowTest1.toBeFluid)
            var flowTest3 = LiquidHorizontalFlowTest(neighbors[2], neighbors[6], flowTest2.toBeFluid)
            var flowTest4 = LiquidHorizontalFlowTest(neighbors[3], neighbors[7], flowTest3.toBeFluid)

            toBeFluid = flowTest4.toBeFluid
            height = Math.max(height, flowTest1.height, flowTest2.height, flowTest3.height, flowTest4.height)
        } else if (thisBlock.includes('flowing')) {
            var flowTest1 = LiquidHorizontalDrainTest(neighbors[4], thisFluid)
            var flowTest2 = LiquidHorizontalDrainTest(neighbors[5], flowTest1.toBeFluid)
            var flowTest3 = LiquidHorizontalDrainTest(neighbors[2], flowTest2.toBeFluid)
            var flowTest4 = LiquidHorizontalDrainTest(neighbors[3], flowTest3.toBeFluid)

            toBeFluid = toBeFluid
            height = Math.max(height, flowTest1.height, flowTest2.height, flowTest3.height, flowTest4.height)
        }
    }

    if (thisBlock == "air" || thisBlock.includes("flowing")) {
        if (toBeFluid == "none") toBeFluid = thisFluid
        flowDelay = (toBeFluid == "water") ? 5 : 30

        if (falling) {
            if (currentHeight != 8 || toBeFluid != thisFluid) ScheduleBlockUpdate(world, {}, position, `flowing_${toBeFluid}[falling=true,level=8]`, thisBlock, 4, true, flowDelay)
        }
        else {
            height -= 1
            if (toBeFluid == "lava") height -= 1
            if (height < 0) height = 0

            if (height != currentHeight || toBeFluid != thisFluid) {
                if (height == 0) ScheduleBlockUpdate(world, {}, position, `air`, thisBlock, 4, false, flowDelay)
                else ScheduleBlockUpdate(world, {}, position, `flowing_${toBeFluid}[falling=false,level=${height}]`, thisBlock, 4, true, flowDelay)
            }
        }
    }
}

function LiquidVerifier(world, neighbors, thisBlock, position, predictedFluid) {
    if (thisBlock != "air" && !thisBlock.includes("water") && !thisBlock.includes("lava")) return {
        update: false
    }

    neighbors.push(
        utils.worldgen.GetBlock({thisPlayer:{upvn:-1}})(world, {}, {x: position.x, y: position.y - 1, z: position.z - 1}),
        utils.worldgen.GetBlock({thisPlayer:{upvn:-1}})(world, {}, {x: position.x, y: position.y - 1, z: position.z + 1}),
        utils.worldgen.GetBlock({thisPlayer:{upvn:-1}})(world, {}, {x: position.x - 1, y: position.y - 1, z: position.z}),
        utils.worldgen.GetBlock({thisPlayer:{upvn:-1}})(world, {}, {x: position.x + 1, y: position.y - 1, z: position.z})
    )

    var currentHeight = 9
    if (thisBlock == "air") currentHeight = 0
    else if (thisBlock.includes("falling=true")) currentHeight = 8
    else if (thisBlock.includes("level=7")) currentHeight = 7
    else if (thisBlock.includes("level=6")) currentHeight = 6
    else if (thisBlock.includes("level=5")) currentHeight = 5
    else if (thisBlock.includes("level=4")) currentHeight = 4
    else if (thisBlock.includes("level=3")) currentHeight = 3
    else if (thisBlock.includes("level=2")) currentHeight = 2
    else if (thisBlock.includes("level=1")) currentHeight = 1

    var height = 0
    var toBeFluid = "none"
    var falling = false

    var thisFluid = thisBlock.includes('water') ? "water" : (thisBlock.includes('lava') ? "lava" : "none")

    // Test flowing down
    var testingFluid = neighbors[1].includes('water') ? "water" : (neighbors[1].includes('lava') ? "lava" : "none")
    if (testingFluid != "none" && (thisFluid == "none" || thisFluid == testingFluid)) {
        toBeFluid = testingFluid
        height = 8
        falling = true
    } else {
        if (thisBlock == "air") {
            var flowTest1 = LiquidHorizontalFlowTest(neighbors[4], neighbors[8], toBeFluid)
            var flowTest2 = LiquidHorizontalFlowTest(neighbors[5], neighbors[9], flowTest1.toBeFluid)
            var flowTest3 = LiquidHorizontalFlowTest(neighbors[2], neighbors[6], flowTest2.toBeFluid)
            var flowTest4 = LiquidHorizontalFlowTest(neighbors[3], neighbors[7], flowTest3.toBeFluid)

            toBeFluid = flowTest4.toBeFluid
            height = Math.max(height, flowTest1.height, flowTest2.height, flowTest3.height, flowTest4.height)
        } else if (thisBlock.includes('flowing')) {
            var flowTest1 = LiquidHorizontalDrainTest(neighbors[4], thisFluid)
            var flowTest2 = LiquidHorizontalDrainTest(neighbors[5], flowTest1.toBeFluid)
            var flowTest3 = LiquidHorizontalDrainTest(neighbors[2], flowTest2.toBeFluid)
            var flowTest4 = LiquidHorizontalDrainTest(neighbors[3], flowTest3.toBeFluid)

            toBeFluid = toBeFluid
            height = Math.max(height, flowTest1.height, flowTest2.height, flowTest3.height, flowTest4.height)
        }
    }

    if (thisBlock == "air" || thisBlock.includes("flowing")) {
        if (toBeFluid == "none") toBeFluid = thisFluid

        if (predictedFluid == "water" && toBeFluid == "lava") {
            if (falling) {
                if (currentHeight != 8) ScheduleBlockUpdate(world, {}, position, `flowing_${toBeFluid}[falling=true,level=8]`, thisBlock, 4, true, 25)
            }
            else {
                height -= 1
                if (toBeFluid == "lava") height -= 1
                if (height < 0) height = 0

                if (height != currentHeight) {
                    if (height == 0) ScheduleBlockUpdate(world, {}, position, `air`, thisBlock, 4, false, 25)
                    else ScheduleBlockUpdate(world, {}, position, `flowing_${toBeFluid}[falling=false,level=${height}]`, thisBlock, 4, true, 25)
                }
            }
            return {update: false}
        } else {
            if (falling) {
                if (currentHeight != 8 || toBeFluid != thisFluid) return {
                    height: 8,
                    toBeFluid: toBeFluid,
                    update: true
                } 
                else return {update: false}
            }
            else {
                height -= 1
                if (toBeFluid == "lava") height -= 1
                if (height < 0) height = 0

                if (height != currentHeight || toBeFluid != thisFluid) {
                    if (height == 0) return {
                        height: 0,
                        update: true
                    }
                    else return {
                        height: height,
                        toBeFluid: toBeFluid,
                        update: true
                    }
                } else return {update: false}
            }
        }
    } else return {update: false}
}

module.exports = {SetBlock, AddBlockUpdate, SendPostPlacementUpdate, SendNeighborChangedUpdate, ScheduleBlockUpdate, GetBlockUpdate}