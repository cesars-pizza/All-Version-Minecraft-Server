const {Socket, World} = require('../../../data_structures.cjs')
const dataReader = require('../../data_reader.cjs')
const packetWriter = require('../../clientbound_packets/packet_writer.cjs')
const utils = require('../../../utils/utils.cjs')

var packetID = 5
var packetIdentifier = "Set Block"

/** 
 * @param {World} world 
 * @param {Socket} socket 
 * @param {Buffer} data 
 */
function ReadPacket(world, socket, data) {
    var splitIndex = data.length - 9

    if (splitIndex >= 0) {
        socket.log(`SERVERBOUND --> ${packetID} "${packetIdentifier}" / ${data.length} bytes`)

        var id = dataReader.readUByte(socket, data, 0)
        var posX = dataReader.readShort(socket, data, id.nextPos)
        var posY = dataReader.readShort(socket, data, posX.nextPos)
        var posZ = dataReader.readShort(socket, data, posY.nextPos)
        var mode = dataReader.readUByte(socket, data, posZ.nextPos)
        var blockID = dataReader.readUByte(socket, data, mode.nextPos)

        if (socket.disconnect == "") {
            var validBlock = world.universalRegistries.block.includes(utils.registry.block.GetBlockName(world, socket.thisPlayer.selectedRegistries.block, blockID.value)) || !world.config.suppressNonUniversalBlocks
            var blockPos = {x: posX.value + 256 * socket.thisPlayer.classicWorldOffset.x, y: posY.value, z: posZ.value + 256 * socket.thisPlayer.classicWorldOffset.z}
            var updateSuccessful = false

            if (utils.math.NegMod(blockPos.x, 32) >= 16 && utils.math.NegMod(blockPos.z, 32) >= 16) {
                var hitBuildIndex = utils.builds.GetBuild(socket)(world, Math.floor(blockPos.x / 32), Math.floor(blockPos.z / 32))
                if (hitBuildIndex == undefined || world.builds[hitBuildIndex].creator == socket.thisPlayer.username) {
                    if (hitBuildIndex == undefined) {
                        hitBuildIndex = world.builds.length
                        world.builds.push(utils.builds.GenerateBuild(socket)(Math.floor(blockPos.x / 32), Math.floor(blockPos.z / 32), socket.thisPlayer.username, socket.thisPlayer.uvni, socket.thisPlayer.settings.defaultBuildSettings))
                    }

                    if (blockPos.y <= 1) {
                        var chunkX = Math.floor(blockPos.x / 16)
                        var chunkZ = Math.floor(blockPos.z / 16)

                        if (utils.collisions.PlayerCollidingWithBuildFloor(socket)(socket, socket.thisPlayer.position, {x: chunkX, y: 1, z: chunkZ}) != "inside") {
                            if (mode.value == 0) {
                                var floorID = world.universalRegistries.block.indexOf(world.builds[hitBuildIndex].floor)
                                floorID++
                                if (floorID == 0 || floorID >= world.universalRegistries.block.length) floorID = 1
                                utils.tick_actions.set_block.AddFloorUpdate(socket)(world, socket, blockPos, world.universalRegistries.block[floorID], false)
                                if (blockPos.y == 1) updateSuccessful = true
                            } else {
                                if (blockID.value == 44) blockID.value = 43
                                if (validBlock) {
                                    utils.tick_actions.set_block.AddFloorUpdate(socket)(world, socket, blockPos, blockID.value, false)
                                    if (blockPos.y == 1) updateSuccessful = true
                                } else socket.thisPlayer.tick.systemMessages.push("This block isn't available in all versions.")
                            }

                            if (mode.value == 0 || validBlock) {
                                for (var i = 0; i < world.loadedPlayers.length; i++) {
                                    if (world.loadedPlayers[i].username != socket.thisPlayer.username && utils.collisions.PlayerCollidingWithBuildFloor(socket)(socket, world.loadedPlayers[i].position, {x: chunkX, y: 1, z: chunkZ}) == "inside") {
                                        utils.player.set.Position(world, world.loadedPlayers[i], {
                                            x: Math.floor(world.loadedPlayers[i].position.x / 16) * 16 - 0.5,
                                            y: 2,
                                            z: Math.floor(world.loadedPlayers[i].position.z / 16) * 16 - 0.5,
                                        })
                                        world.loadedPlayers[i].tick.systemMessages.push("You have been moved for intruding block placement")
                                        world.loadedPlayers[i].tick.teleportSelf = true
                                    }
                                }
                            }
                        }
                    } else if (blockPos.y < 64) {
                        if (mode.value == 1) {
                            if (validBlock) {
                                if (blockPos.y > 2 && blockID.value == 44 && utils.worldgen.GetBlock(socket)(world, socket, {x: blockPos.x, y: blockPos.y - 1, z: blockPos.z}) == "smooth_stone_slab") {
                                    utils.tick_actions.set_block.AddBlockUpdate(socket)(world, socket, {x: blockPos.x, y: blockPos.y - 1, z: blockPos.z}, "smooth_stone_slab[type=double]", false, "smooth_stone_slab")
                                    for (var i = 0; i < world.loadedPlayers.length; i++) {
                                        if (world.loadedPlayers[i].username != socket.thisPlayer.username && utils.collisions.PlayerCollidingWithBlock(socket)(world, socket, world.loadedPlayers[i].position, blockPos) != "none") {
                                            utils.player.set.Position(world, world.loadedPlayers[i], {
                                                x: Math.floor(world.loadedPlayers[i].position.x / 16) * 16 - 0.5,
                                                y: 2,
                                                z: Math.floor(world.loadedPlayers[i].position.z / 16) * 16 - 0.5,
                                            })
                                            world.loadedPlayers[i].tick.systemMessages.push("You have been moved for intruding block placement")
                                            world.loadedPlayers[i].tick.teleportSelf = true
                                        }
                                    }
                                } else {
                                    utils.tick_actions.set_block.AddBlockUpdate(socket)(world, socket, blockPos, blockID.value, false, 0)
                                    for (var i = 0; i < world.loadedPlayers.length; i++) {
                                        if (world.loadedPlayers[i].username != socket.thisPlayer.username && utils.collisions.PlayerCollidingWithBlock(socket)(world, socket, world.loadedPlayers[i].position, blockPos) != "none") {
                                            utils.player.set.Position(world, world.loadedPlayers[i], {
                                                x: Math.floor(world.loadedPlayers[i].position.x / 16) * 16 - 0.5,
                                                y: 2,
                                                z: Math.floor(world.loadedPlayers[i].position.z / 16) * 16 - 0.5,
                                            })
                                            world.loadedPlayers[i].tick.systemMessages.push("You have been moved for intruding block placement")
                                            world.loadedPlayers[i].tick.teleportSelf = true
                                        }
                                    }
                                    updateSuccessful = true
                                }
                            } else socket.thisPlayer.tick.errorMessages.push("This block isn't available in all versions.")
                        } else {
                            utils.tick_actions.set_block.AddBlockUpdate(socket)(world, socket, blockPos, 0, false, utils.worldgen.GetBlock(socket)(world, socket, blockPos))
                            updateSuccessful = true
                        }
                    }
                }
            }

            if (!updateSuccessful && blockPos.y < 64) {
                var oldBlockUpdate = utils.tick_actions.set_block.GetBlockUpdate(socket)(world, {x: blockPos.x, y: blockPos.y, z: blockPos.z})

                if (oldBlockUpdate == -1) {
                    packetWriter.Classic.Set_Block(socket)(socket, blockPos, utils.registry.block.GetBlockID(world, socket.thisPlayer.selectedRegistries.block, utils.worldgen.GetBlock(socket)(world, socket, blockPos)))
                }
            }
        }

    }
    
    return splitIndex
}

module.exports = {ReadPacket}