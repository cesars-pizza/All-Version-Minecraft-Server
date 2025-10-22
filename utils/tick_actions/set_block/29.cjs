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
    console.log(`Block update at (${position.x}, ${position.y}, ${position.z})`)

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
                utils.tick_actions.set_block.SendPostPlacementUpdate(socket)(world, socket, neighbors[i], position, blockName)
        }
    }
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

        var canFlow = false
        var flowDelay = 5
        var height = -1
        var toBeLiquid = "none"
        var horizontalFlowTest = false

        var liquidNeighbors = 0

        var thisFluid = thisBlock.includes('water') ? "water" : (thisBlock.includes('lava') ? "lava" : "none")

        // Test flowing down
        var testingFluid = neighbors[1].includes('water') ? "water" : (neighbors[1].includes('lava') ? "lava" : "none")
        if (testingFluid != "none") liquidNeighbors++
        if (testingFluid != "none" && (thisFluid == "none" || thisFluid == testingFluid)) {
            if (currentHeight < 8) {
                canFlow = true
                toBeLiquid = testingFluid
                height = 8
            }
        } else {
            // Test flow from X- source
            var testingFluid = neighbors[4].includes('water') ? "water" : (neighbors[4].includes('lava') ? "lava" : "none")
            if (testingFluid != "none") liquidNeighbors++
            if (testingFluid != "none" && (thisFluid == "none" || thisFluid == testingFluid) && !neighbors[4].includes("flowing")) {
                toBeLiquid = testingFluid
                height = 8
                horizontalFlowTest = true
                console.log(`A, ${toBeLiquid}, ${height}`)
            }
            // Test flow from X-
            else if (testingFluid != "none" && (thisFluid == "none" || thisFluid == testingFluid) && neighbors[4].includes("flowing") && neighbors[8] != "air" && !neighbors[8].includes(testingFluid)) {
                var testingFluidLevel = 7
                    if (neighbors[4].includes("level=6")) testingFluidLevel = 6
                else if (neighbors[4].includes("level=5")) testingFluidLevel = 5
                else if (neighbors[4].includes("level=4")) testingFluidLevel = 4
                else if (neighbors[4].includes("level=3")) testingFluidLevel = 3
                else if (neighbors[4].includes("level=2")) testingFluidLevel = 2
                else if (neighbors[4].includes("level=1")) testingFluidLevel = 1

                if (height < testingFluidLevel && (toBeLiquid == "none" || toBeLiquid == testingFluid)) {
                    toBeLiquid = testingFluid
                    height = testingFluidLevel
                    horizontalFlowTest = true
                    console.log(`B, ${toBeLiquid}, ${height}`)
                }
            }

            // Test flow from X+ source
            var testingFluid = neighbors[5].includes('water') ? "water" : (neighbors[5].includes('lava') ? "lava" : "none")
            if (testingFluid != "none") liquidNeighbors++
            if (testingFluid != "none" && (thisFluid == "none" || thisFluid == testingFluid) && !neighbors[5].includes("flowing") && (toBeLiquid == "none" || toBeLiquid == testingFluid)) {
                toBeLiquid = testingFluid
                height = 8
                horizontalFlowTest = true
                console.log(`C, ${toBeLiquid}, ${height}`)
            }
            // Test flow from X+
            else if (testingFluid != "none" && (thisFluid == "none" || thisFluid == testingFluid) && neighbors[5].includes("flowing") && neighbors[9] != "air" && !neighbors[9].includes(testingFluid)) {
                var testingFluidLevel = 7
                    if (neighbors[5].includes("level=6")) testingFluidLevel = 6
                else if (neighbors[5].includes("level=5")) testingFluidLevel = 5
                else if (neighbors[5].includes("level=4")) testingFluidLevel = 4
                else if (neighbors[5].includes("level=3")) testingFluidLevel = 3
                else if (neighbors[5].includes("level=2")) testingFluidLevel = 2
                else if (neighbors[5].includes("level=1")) testingFluidLevel = 1

                if (height < testingFluidLevel && (toBeLiquid == "none" || toBeLiquid == testingFluid)) {
                    toBeLiquid = testingFluid
                    height = testingFluidLevel
                    horizontalFlowTest = true
                    console.log(`D, ${toBeLiquid}, ${height}`)
                }
            }

            // Test flow from Z- source
            var testingFluid = neighbors[2].includes('water') ? "water" : (neighbors[2].includes('lava') ? "lava" : "none")
            if (testingFluid != "none") liquidNeighbors++
            if (testingFluid != "none" && (thisFluid == "none" || thisFluid == testingFluid) && !neighbors[2].includes("flowing") && (toBeLiquid == "none" || toBeLiquid == testingFluid)) {
                toBeLiquid = testingFluid
                height = 8
                horizontalFlowTest = true
                console.log(`E, ${toBeLiquid}, ${height}`)
            }
            // Test flow from Z-
            else if (testingFluid != "none" && (thisFluid == "none" || thisFluid == testingFluid) && neighbors[2].includes("flowing") && neighbors[6] != "air" && !neighbors[6].includes(testingFluid)) {
                var testingFluidLevel = 7
                    if (neighbors[2].includes("level=6")) testingFluidLevel = 6
                else if (neighbors[2].includes("level=5")) testingFluidLevel = 5
                else if (neighbors[2].includes("level=4")) testingFluidLevel = 4
                else if (neighbors[2].includes("level=3")) testingFluidLevel = 3
                else if (neighbors[2].includes("level=2")) testingFluidLevel = 2
                else if (neighbors[2].includes("level=1")) testingFluidLevel = 1

                if (height < testingFluidLevel && (toBeLiquid == "none" || toBeLiquid == testingFluid)) {
                    toBeLiquid = testingFluid
                    height = testingFluidLevel
                    horizontalFlowTest = true
                    console.log(`F, ${toBeLiquid}, ${height}`)
                }
            }

            // Test flow from Z+ source
            var testingFluid = neighbors[3].includes('water') ? "water" : (neighbors[3].includes('lava') ? "lava" : "none")
            if (testingFluid != "none") liquidNeighbors++
            if (testingFluid != "none" && (thisFluid == "none" || thisFluid == testingFluid) && !neighbors[3].includes("flowing") && (toBeLiquid == "none" || toBeLiquid == testingFluid)) {
                toBeLiquid = testingFluid
                height = 8
                horizontalFlowTest = true
                console.log(`G, ${toBeLiquid}, ${height}`)
            }
            // Test flow from Z+
            else if (testingFluid != "none" && (thisFluid == "none" || thisFluid == testingFluid) && neighbors[3].includes("flowing") && neighbors[7] != "air" && !neighbors[7].includes(testingFluid)) {
                var testingFluidLevel = 7
                    if (neighbors[3].includes("level=6")) testingFluidLevel = 6
                else if (neighbors[3].includes("level=5")) testingFluidLevel = 5
                else if (neighbors[3].includes("level=4")) testingFluidLevel = 4
                else if (neighbors[3].includes("level=3")) testingFluidLevel = 3
                else if (neighbors[3].includes("level=2")) testingFluidLevel = 2
                else if (neighbors[3].includes("level=1")) testingFluidLevel = 1

                if (height < testingFluidLevel && (toBeLiquid == "none" || toBeLiquid == testingFluid)) {
                    toBeLiquid = testingFluid
                    height = testingFluidLevel
                    horizontalFlowTest = true
                    console.log(`H, ${toBeLiquid}, ${height}`)
                }
            }
        }

        if (thisBlock.includes("flowing") && liquidNeighbors == 0) {
            canFlow = true
            height = 0
            toBeLiquid = thisFluid
        }

        flowDelay = (toBeLiquid == "water") ? 5 : 30

        if (thisBlock != "air" && !thisBlock.includes("flowing")) horizontalFlowTest = false

        if (horizontalFlowTest) {
            console.log(height)

            height -= 1
            if (toBeLiquid == "lava") height -= 1
            if (height < 0) height = 0

            console.log(height)
            console.log(currentHeight)
            if (height != currentHeight) canFlow = true
        }

        if (canFlow) {
            if (height == 9) ScheduleBlockUpdate(world, {}, position, `${toBeLiquid}`, thisBlock, 4, false, flowDelay)
            else if (height == 8) ScheduleBlockUpdate(world, {}, position, `flowing_${toBeLiquid}[falling=true,level=8]`, thisBlock, 4, false, flowDelay)
            else if (height == 0) ScheduleBlockUpdate(world, {}, position, `air`, thisBlock, 4, false, flowDelay)
            else ScheduleBlockUpdate(world, {}, position, `flowing_${toBeLiquid}[falling=false,level=${height}]`, thisBlock, 4, false, flowDelay)
        }
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
    console.log(`Scheduled block update from ${prevBlockID} to ${blockID} at (${position.x}, ${position.y}, ${position.z}) in ${delay} ticks`)

    var buildIndex = utils.builds.GetBuild(socket)(world, Math.floor(position.x / 32), Math.floor(position.z / 32))

    if (typeof(blockID) == "number") blockID = utils.registry.block.GetBlockName(world, socket.thisPlayer.selectedRegistries.block, blockID)
    if (typeof(prevBlockID) == "number") prevBlockID = utils.registry.block.GetBlockName(world, socket.thisPlayer.selectedRegistries.block, prevBlockID)

    if (buildIndex != -1 && buildIndex != undefined) {
        for (var i = 0; i < world.builds[buildIndex].scheduledBlockUpdates.length; i++) {
            if (position.x == world.builds[buildIndex].scheduledBlockUpdates[i].position.x && position.y == world.builds[buildIndex].scheduledBlockUpdates[i].position.y && position.z == world.builds[buildIndex].scheduledBlockUpdates[i].position.z) {console.log(`Scheduled block update cancelled at index ${i}, (in ${world.builds[buildIndex].scheduledBlockUpdates[i].delay} ticks)`); return}
        }

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