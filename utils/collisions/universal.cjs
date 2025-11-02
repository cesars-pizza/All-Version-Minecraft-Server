const { World, Socket, Position, Player, Rotation } = require("../../data_structures.cjs");
const utils = require('../utils.cjs')

function CollidingWithFullBlock(playerPos, playerHeight, playerWidth, blockPos) {
    var blockCenter = {x: blockPos.x + 0.5, y: blockPos.y + 0.5, z: blockPos.z + 0.5}
    var playerCenter = {x: playerPos.x, y: playerPos.y + (playerHeight / 2), z: playerPos.z}

    var absDifference = {
        x: Math.abs(blockCenter.x - playerCenter.x),
        y: Math.abs(blockCenter.y - playerCenter.y),
        z: Math.abs(blockCenter.z - playerCenter.z)
    }

    var minimumDistance = {
        x: ((playerWidth / 2) + 0.5), 
        y: ((playerHeight / 2) + 0.5),
        z: ((playerWidth / 2) + 0.5) 
    }

    if (absDifference.x < minimumDistance.x && absDifference.y < minimumDistance.y && absDifference.z < minimumDistance.z) return "inside"
    if (absDifference.x <= minimumDistance.x && absDifference.y <= minimumDistance.y && absDifference.z <= minimumDistance.z) return "against"
    return "none"
}

function CollidingWithPressurePlate(playerPos, playerHeight, playerWidth, blockPos) {
    var blockCenter = {x: blockPos.x + 0.5, y: blockPos.y + 0.125, z: blockPos.z + 0.5}
    var playerCenter = {x: playerPos.x, y: playerPos.y + (playerHeight / 2), z: playerPos.z}

    var absDifference = {
        x: Math.abs(blockCenter.x - playerCenter.x),
        y: Math.abs(blockCenter.y - playerCenter.y),
        z: Math.abs(blockCenter.z - playerCenter.z)
    }

    var minimumDistance = {
        x: ((playerWidth / 2) + 0.5), 
        y: ((playerHeight / 2) + 0.125),
        z: ((playerWidth / 2) + 0.5) 
    }

    if (absDifference.x < minimumDistance.x && absDifference.y < minimumDistance.y && absDifference.z < minimumDistance.z) return "inside"
    if (absDifference.x <= minimumDistance.x && absDifference.y <= minimumDistance.y && absDifference.z <= minimumDistance.z) return "against"
    return "none"
}

function PlayerCollisionFunctions(world, socket, position) {
    var roundedPosition = {x: Math.round(position.x), y: Math.floor(position.y), z: Math.round(position.z)}

    var blockPoss = [
        // Player Feet
        {x: roundedPosition.x - 1, y: roundedPosition.y, z: roundedPosition.z - 1},     // Neg Neg Corner - 00
        {x: roundedPosition.x - 1, y: roundedPosition.y, z: roundedPosition.z},         // Neg Pos Corner - 01
        {x: roundedPosition.x, y: roundedPosition.y, z: roundedPosition.z - 1},         // Pos Neg Corner - 02
        {x: roundedPosition.x, y: roundedPosition.y, z: roundedPosition.z},             // Pos Pos Corner - 03
        // +1 Y
        {x: roundedPosition.x - 1, y: roundedPosition.y + 1, z: roundedPosition.z - 1}, // Neg Neg Corner - 04
        {x: roundedPosition.x - 1, y: roundedPosition.y + 1, z: roundedPosition.z},     // Neg Pos Corner - 05
        {x: roundedPosition.x, y: roundedPosition.y + 1, z: roundedPosition.z - 1},     // Pos Neg Corner - 06
        {x: roundedPosition.x, y: roundedPosition.y + 1, z: roundedPosition.z},         // Pos Pos Corner - 07
        // +2 Y
        {x: roundedPosition.x - 1, y: roundedPosition.y + 2, z: roundedPosition.z - 1}, // Neg Neg Corner - 08
        {x: roundedPosition.x - 1, y: roundedPosition.y + 2, z: roundedPosition.z},     // Neg Pos Corner - 09
        {x: roundedPosition.x, y: roundedPosition.y + 2, z: roundedPosition.z - 1},     // Pos Neg Corner - 10
        {x: roundedPosition.x, y: roundedPosition.y + 2, z: roundedPosition.z},         // Pos Pos Corner - 11
    ]

    var blocks = [
        // Player Feet
        utils.worldgen.GetBlock(socket)(world, socket, blockPoss[0]),  // Neg Neg Corner - 00
        utils.worldgen.GetBlock(socket)(world, socket, blockPoss[1]),  // Neg Pos Corner - 01
        utils.worldgen.GetBlock(socket)(world, socket, blockPoss[2]),  // Pos Neg Corner - 02
        utils.worldgen.GetBlock(socket)(world, socket, blockPoss[3]),  // Pos Pos Corner - 03
        // +1 Y
        utils.worldgen.GetBlock(socket)(world, socket, blockPoss[4]),  // Neg Neg Corner - 04
        utils.worldgen.GetBlock(socket)(world, socket, blockPoss[5]),  // Neg Pos Corner - 05
        utils.worldgen.GetBlock(socket)(world, socket, blockPoss[6]),  // Pos Neg Corner - 06
        utils.worldgen.GetBlock(socket)(world, socket, blockPoss[7]),  // Pos Pos Corner - 07
        // +2 Y
        utils.worldgen.GetBlock(socket)(world, socket, blockPoss[8]),  // Neg Neg Corner - 08
        utils.worldgen.GetBlock(socket)(world, socket, blockPoss[9]),  // Neg Pos Corner - 09
        utils.worldgen.GetBlock(socket)(world, socket, blockPoss[10]), // Pos Neg Corner - 10
        utils.worldgen.GetBlock(socket)(world, socket, blockPoss[11])  // Pos Pos Corner - 11
    ]

    var collisions = [
        // Player Feet
        utils.collisions.PlayerCollidingWithBlock(socket)(world, socket, position, blockPoss[0], blocks[0]),   // Neg Neg Corner - 00
        utils.collisions.PlayerCollidingWithBlock(socket)(world, socket, position, blockPoss[1], blocks[1]),   // Neg Pos Corner - 01
        utils.collisions.PlayerCollidingWithBlock(socket)(world, socket, position, blockPoss[2], blocks[2]),   // Pos Neg Corner - 02
        utils.collisions.PlayerCollidingWithBlock(socket)(world, socket, position, blockPoss[3], blocks[3]),   // Pos Pos Corner - 03
        // +1 Y 
        utils.collisions.PlayerCollidingWithBlock(socket)(world, socket, position, blockPoss[4], blocks[4]),   // Neg Neg Corner - 04
        utils.collisions.PlayerCollidingWithBlock(socket)(world, socket, position, blockPoss[5], blocks[5]),   // Neg Pos Corner - 05
        utils.collisions.PlayerCollidingWithBlock(socket)(world, socket, position, blockPoss[6], blocks[6]),   // Pos Neg Corner - 06
        utils.collisions.PlayerCollidingWithBlock(socket)(world, socket, position, blockPoss[7], blocks[7]),   // Pos Pos Corner - 07
        // +2 Y 
        utils.collisions.PlayerCollidingWithBlock(socket)(world, socket, position, blockPoss[8], blocks[8]),   // Neg Neg Corner - 08
        utils.collisions.PlayerCollidingWithBlock(socket)(world, socket, position, blockPoss[9], blocks[9]),   // Neg Pos Corner - 09
        utils.collisions.PlayerCollidingWithBlock(socket)(world, socket, position, blockPoss[10], blocks[10]), // Pos Neg Corner - 10
        utils.collisions.PlayerCollidingWithBlock(socket)(world, socket, position, blockPoss[11], blocks[11]), // Pos Pos Corner - 11
    ]

    // Test Pressure Plates
    PlayerCollisionPressurePlateFunction(world, socket, blocks[0], blockPoss[0], collisions[0])
    PlayerCollisionPressurePlateFunction(world, socket, blocks[1], blockPoss[1], collisions[1])
    PlayerCollisionPressurePlateFunction(world, socket, blocks[2], blockPoss[2], collisions[2])
    PlayerCollisionPressurePlateFunction(world, socket, blocks[3], blockPoss[3], collisions[3])
}

function PlayerCollisionPressurePlateFunction(world, socket, block, blockPos, collision) {
    if (utils.tag(world, block, "pressure_plates") && collision == "inside") {
        var blockState = utils.registry.block.GetBlockState(world, 0, block)
        if (blockState.states.powered == "false") utils.tick_actions.set_block.AddBlockUpdate(socket)(world, socket, blockPos, `${blockState.block}[powered=true]`, false, block, false)
    }
}

module.exports = {CollidingWithFullBlock, CollidingWithPressurePlate, PlayerCollisionFunctions, PlayerCollisionPressurePlateFunction}