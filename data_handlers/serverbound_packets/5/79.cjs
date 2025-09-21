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
            var blockPos = {x: posX.value, y: posY.value, z: posZ.value}
            var updateSuccessful = false

            if (utils.math.NegMod(posX.value, 32) >= 16 && utils.math.NegMod(posZ.value, 32) >= 16) {
                var hitBuildIndex = utils.builds.GetBuild(socket)(world, Math.floor(posX.value / 32), Math.floor(posZ.value / 32))
                if (hitBuildIndex == undefined || world.builds[hitBuildIndex].creator == socket.thisPlayer.username) {
                    if (hitBuildIndex == undefined) {
                        hitBuildIndex = world.builds.length
                        world.builds.push(utils.builds.GenerateBuild(socket)(Math.floor(posX.value / 32), Math.floor(posZ.value / 32), socket.thisPlayer.username, socket.thisPlayer.uvni))
                    }

                    if (posY.value <= 1) {
                        var chunkX = Math.floor(posX.value / 16)
                        var chunkZ = Math.floor(posZ.value / 16)

                        if (utils.player.CollidingWithChunkLayer(socket)(socket, socket.thisPlayer.position, {x: chunkX, y: 1, z: chunkZ}) != "inside") {
                            if (mode.value == 0) {
                                var floorID = world.universalRegistries.block.indexOf(world.builds[hitBuildIndex].floor)
                                floorID++
                                if (floorID == 0 || floorID >= world.universalRegistries.block.length) floorID = 1
                                var thisRegistryFloorID = utils.registry.block.GetBlockID(world, socket.thisPlayer.selectedRegistries.block, world.universalRegistries.block[floorID])
                                world.builds[hitBuildIndex].floor = world.universalRegistries.block[floorID]
                                world.builds[hitBuildIndex].lastModified = new Date().getTime()
                                world.builds[hitBuildIndex].save = true
                                for (var x = 0; x < 16; x++) {
                                    for (var z = 0; z < 16; z++) {
                                        var setX = chunkX * 16 + x
                                        var setZ = chunkZ * 16 + z
                                        utils.tick_actions.set_block.AddBlockUpdate(socket)(world, socket, {x: setX, y: 1, z: setZ}, thisRegistryFloorID)
                                    }
                                }
                                if (blockPos.y == 1) updateSuccessful = true
                            } else {
                                if (blockID.value == 44) blockID.value = 43
                                if (validBlock) {
                                    world.builds[hitBuildIndex].floor = utils.registry.block.GetBlockName(world, socket.thisPlayer.selectedRegistries.block, blockID.value)
                                    world.builds[hitBuildIndex].lastModified = new Date().getTime()
                                    world.builds[hitBuildIndex].save = true
                                    for (var x = 0; x < 16; x++) {
                                        for (var z = 0; z < 16; z++) {
                                            var setX = chunkX * 16 + x
                                            var setZ = chunkZ * 16 + z
                                            utils.tick_actions.set_block.AddBlockUpdate(socket)(world, socket, {x: setX, y: 1, z: setZ}, blockID.value)
                                        }
                                    }
                                    if (blockPos.y == 1) updateSuccessful = true
                                } else socket.thisPlayer.tick.systemMessages.push("This block isn't available in all versions.")
                            }

                            if (mode.value == 0 || validBlock) {
                                for (var i = 0; i < world.loadedPlayers.length; i++) {
                                    if (world.loadedPlayers[i].username != socket.thisPlayer.username && utils.player.CollidingWithChunkLayer(socket)(socket, world.loadedPlayers[i].position, {x: chunkX, y: 1, z: chunkZ}) == "inside") {
                                        world.loadedPlayers[i].position = {
                                            x: Math.floor(world.loadedPlayers[i].position.x / 16) * 16 - 0.5,
                                            y: 2,
                                            z: Math.floor(world.loadedPlayers[i].position.z / 16) * 16 - 0.5,
                                        }
                                        world.loadedPlayers[i].save = true
                                        world.loadedPlayers[i].tick.position = true
                                        world.loadedPlayers[i].tick.systemMessages.push("You have been moved for intruding block placement")
                                        world.loadedPlayers[i].tick.teleportSelf = true
                                    }
                                }
                            }
                        }
                    } else if (posY.value < 64) {
                        if (mode.value == 1) {
                            if (validBlock) {
                                if (posY.value > 2 && blockID.value == 44 && utils.worldgen.GetBlock(socket)(world, socket, {x: posX.value, y: posY.value - 1, z: posZ.value}) == "smooth_stone_slab") {
                                    world.builds[hitBuildIndex].blocks[posY.value - 3][posZ.value % 16][posX.value % 16] = "smooth_stone_slab[type=double]"
                                    utils.tick_actions.set_block.AddBlockUpdate(socket)(world, socket, {x: posX.value, y: posY.value - 1, z: posZ.value}, 43)
                                    for (var i = 0; i < world.loadedPlayers.length; i++) {
                                        if (world.loadedPlayers[i].username != socket.thisPlayer.username && utils.player.CollidingWithBlock(socket)(socket, world.loadedPlayers[i].position, blockPos) != "none") {
                                            world.loadedPlayers[i].position = {
                                                x: Math.floor(world.loadedPlayers[i].position.x / 16) * 16 - 0.5,
                                                y: 2,
                                                z: Math.floor(world.loadedPlayers[i].position.z / 16) * 16 - 0.5,
                                            }
                                            world.loadedPlayers[i].save = true
                                            world.loadedPlayers[i].tick.position = true
                                            world.loadedPlayers[i].tick.systemMessages.push("You have been moved for intruding block placement")
                                            world.loadedPlayers[i].tick.teleportSelf = true
                                        }
                                    }
                                } else {
                                    world.builds[hitBuildIndex].blocks[posY.value - 2][posZ.value % 16][posX.value % 16] = utils.registry.block.GetBlockName(world, socket.thisPlayer.selectedRegistries.block, blockID.value)
                                    utils.tick_actions.set_block.AddBlockUpdate(socket)(world, socket, blockPos, blockID.value)
                                    for (var i = 0; i < world.loadedPlayers.length; i++) {
                                        if (world.loadedPlayers[i].username != socket.thisPlayer.username && utils.player.CollidingWithBlock(socket)(socket, world.loadedPlayers[i].position, blockPos) != "none") {
                                            world.loadedPlayers[i].position = {
                                                x: Math.floor(world.loadedPlayers[i].position.x / 16) * 16 - 0.5,
                                                y: 2,
                                                z: Math.floor(world.loadedPlayers[i].position.z / 16) * 16 - 0.5,
                                            }
                                            world.loadedPlayers[i].save = true
                                            world.loadedPlayers[i].tick.position = true
                                            world.loadedPlayers[i].tick.systemMessages.push("You have been moved for intruding block placement")
                                            world.loadedPlayers[i].tick.teleportSelf = true
                                        }
                                    }
                                    updateSuccessful = true
                                }
                                
                                world.builds[hitBuildIndex].lastModified = new Date().getTime()
                                world.builds[hitBuildIndex].save = true
                            } else socket.thisPlayer.tick.systemMessages.push("This block isn't available in all versions.")
                        } else {
                            world.builds[hitBuildIndex].blocks[posY.value - 2][posZ.value % 16][posX.value % 16] = "air"
                            utils.tick_actions.set_block.AddBlockUpdate(socket)(world, socket, blockPos, 0)
                            world.builds[hitBuildIndex].lastModified = new Date().getTime()
                            world.builds[hitBuildIndex].save = true
                            updateSuccessful = true
                        }
                    }
                }
            }

            if (!updateSuccessful && posY.value < 64) {
                var oldBlockUpdate = utils.tick_actions.set_block.GetBlockUpdate(socket)(world, {x: posX.value, y: posY.value, z: posZ.value})

                if (oldBlockUpdate == -1) {
                    packetWriter.Set_Block(socket)(socket, blockPos, utils.registry.block.GetBlockID(world, socket.thisPlayer.selectedRegistries.block, utils.worldgen.GetBlock(socket)(world, socket, blockPos)))
                }
            }
        }

    }
    
    return splitIndex
}

module.exports = {ReadPacket}