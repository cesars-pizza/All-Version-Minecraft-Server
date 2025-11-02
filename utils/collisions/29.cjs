const packet_writer = require("../../data_handlers/clientbound_packets/packet_writer.cjs");
const { World, Socket, Position, Player } = require("../../data_structures.cjs");
const utils = require("../utils.cjs");

/**
 * @param {Socket} socket 
 * @param {Position} playerPos 
 * @param {Position} blockPos 
 */
function PlayerCollidingWithBlock(world, socket, playerPos, blockPos, block) {
    var playerWidth = 0.59374998
    var playerHeight = 1.69999998

    if (utils.tag(world, block, "pressure_plates")) return utils.collisions.CollidingWithPressurePlate(playerPos, playerHeight, playerWidth, blockPos)
    else return utils.collisions.CollidingWithFullBlock(playerPos, playerHeight, playerWidth, blockPos)
}

function PlayerCollidingWithBuildFloor(socket, playerPos, layerPos) {
    var playerWidth = 0.59374998
    var playerHeight = 1.69999998

    var blockCenter = {x: layerPos.x * 16 + 8, y: layerPos.y + 0.5, z: layerPos.z * 16 + 8}
    var playerCenter = {x: playerPos.x, y: playerPos.y + (playerHeight / 2), z: playerPos.z}

    var absDifference = {
        x: Math.round(Math.abs(blockCenter.x - playerCenter.x) * 32),
        y: Math.round(Math.abs(blockCenter.y - playerCenter.y) * 32),
        z: Math.round(Math.abs(blockCenter.z - playerCenter.z) * 32)
    }

    var minimumDistance = {
        x: Math.round(((playerWidth / 2) + 8) * 32),
        y: Math.round(((playerHeight / 2) + 0.5) * 32),
        z: Math.round(((playerWidth / 2) + 8) * 32)
    }

    if (absDifference.x < minimumDistance.x && absDifference.y < minimumDistance.y && absDifference.z < minimumDistance.z) return "inside"
    if (absDifference.x <= minimumDistance.x && absDifference.y <= minimumDistance.y && absDifference.z <= minimumDistance.z) return "against"
    return "none"
}

function PlayerCollidingWithBuildVolume(position) {
    var playerWidth = 0.59374998
    
    return (
        (utils.math.NegMod(position.x, 32) >= (16 - (playerWidth / 2)) || 
        utils.math.NegMod(position.x, 32) <= (playerWidth / 2)) && 
        (utils.math.NegMod(position.z, 32) >= (16 - (playerWidth / 2)) ||
        utils.math.NegMod(position.z, 32) <= (playerWidth / 2))
    )
}

module.exports = {PlayerCollidingWithBlock, PlayerCollidingWithBuildFloor, PlayerCollidingWithBuildVolume}