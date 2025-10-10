const {Socket, World} = require('../../../data_structures.cjs')
const dataReader = require('../../data_reader.cjs')
const packetWriter = require('../../clientbound_packets/packet_writer.cjs')
const utils = require('../../../utils/utils.cjs')
const { HexViewBytes } = require('../../../server.cjs')

var packetID = 15
var packetIdentifier = "Player Block Placement"

/** 
 * @param {World} world 
 * @param {Socket} socket 
 * @param {Buffer} data 
 */
function ReadPacket(world, socket, data) {
    var splitIndex = data.length - 13

    socket.log(`SERVERBOUND --> ${packetID} "${packetIdentifier}" / ${data.length} bytes`)

    if (splitIndex >= 0) {
        var item = dataReader.readShort(socket, data, 1)
        var posX = dataReader.readInt(socket, data, item.nextPos)
        var posY = dataReader.readByte(socket, data, posX.nextPos)
        var posZ = dataReader.readInt(socket, data, posY.nextPos)
        var face = dataReader.readByte(socket, data, posZ.nextPos)

        if (socket.disconnect == "") {
            console.log(item.value)
            var placedName = utils.registry.item.GetItemName(world, socket.thisPlayer.selectedRegistries.item, item.value)
            if (placedName == "water_bucket") placedName = "water"
            else if (placedName == "lava_bucket") placedName = "lava"
            else if (placedName == "flint_and_steel") placedName = "fire"
            else if (placedName == "redstone") placedName = "redstone_wire"
            else if (placedName == "wooden_hoe") placedName = "farmland"
            else if (placedName == "stone_hoe") placedName = "farmland"
            else if (placedName == "iron_hoe") placedName = "farmland"
            else if (placedName == "diamond_hoe") placedName = "farmland"
            else if (placedName == "golden_hoe") placedName = "farmland"
            else if (placedName == "wheat_seeds") placedName = "wheat"

            var validBlock = world.universalRegistries.block.includes(placedName) || !world.config.suppressNonUniversalBlocks
            var validEntity = false // Need to implement entity registry
            var originalBlock = {x: posX.value, y: posY.value, z: posZ.value}
            originalBlock.block = utils.worldgen.GetBlock(socket)(world, socket, originalBlock)
            var facingBlock = {x: posX.value, y: posY.value, z: posZ.value}
            if (face.value == 0) facingBlock.y--
            else if (face.value == 1) facingBlock.y++
            else if (face.value == 2) facingBlock.z--
            else if (face.value == 3) facingBlock.z++
            else if (face.value == 4) facingBlock.x--
            else if (face.value == 5) facingBlock.x++
            facingBlock.block = utils.worldgen.GetBlock(socket)(world, socket, facingBlock)

            var updateSuccessful = false

            if (utils.math.NegMod(facingBlock.x, 32) >= 16 && utils.math.NegMod(facingBlock.z, 32) >= 16) {
                var hitBuildIndex = utils.builds.GetBuild(socket)(world, Math.floor(facingBlock.x / 32), Math.floor(facingBlock.z / 32))
                if (hitBuildIndex == undefined || world.builds[hitBuildIndex].creator == socket.thisPlayer.username) {
                    if (hitBuildIndex == undefined) {
                        hitBuildIndex = world.builds.length
                        world.builds.push(utils.builds.GenerateBuild(socket)(Math.floor(facingBlock.x / 32), Math.floor(facingBlock.z / 32), socket.thisPlayer.username, socket.thisPlayer.uvni))
                    }

                    if (facingBlock.y <= 1) {
                        var chunkX = Math.floor(facingBlock.x / 16)
                        var chunkZ = Math.floor(facingBlock.z / 16)

                        if (utils.player.CollidingWithChunkLayer(socket)(socket, socket.thisPlayer.position, {x: chunkX, y: 1, z: chunkZ}) != "inside") {
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
                                if (facingBlock.y == 1) updateSuccessful = true
                            } else socket.thisPlayer.tick.systemMessages.push("This block isn't available in all versions.")

                            if (validBlock) {
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
                    } else if (facingBlock.y < 64) {
                        console.log(placedName)
                        if (placedName == "smooth_stone_slab") {
                            if (validBlock) {
                                if (face.value == 1) {
                                    if (originalBlock.block == placedName) {
                                        if (utils.player.CollidingWithBlock(socket)(socket, socket.thisPlayer.position, originalBlock) != "inside") {
                                            world.builds[hitBuildIndex].blocks[originalBlock.y - 2][originalBlock.z % 16][originalBlock.x % 16] = placedName + "[type=double]"
                                            utils.tick_actions.set_block.AddBlockUpdate(socket)(world, socket, originalBlock, placedName + "[type=double]")
                                            if (facingBlock.block == "air") packetWriter.Block_Change(socket)(world, socket, facingBlock, 0, 0)
                                            updateSuccessful = true
                                        }
                                    } else {
                                        if (facingBlock.block == "air" && utils.player.CollidingWithBlock(socket)(socket, socket.thisPlayer.position, facingBlock) != "inside") {
                                            world.builds[hitBuildIndex].blocks[facingBlock.y - 2][facingBlock.z % 16][facingBlock.x % 16] = placedName
                                            utils.tick_actions.set_block.AddBlockUpdate(socket)(world, socket, facingBlock, placedName)
                                            updateSuccessful = true
                                        }
                                    }
                                } else {
                                    if (utils.player.CollidingWithBlock(socket)(socket, socket.thisPlayer.position, facingBlock) != "inside") {
                                        if (facingBlock.block == placedName) {
                                            world.builds[hitBuildIndex].blocks[facingBlock.y - 2][facingBlock.z % 16][facingBlock.x % 16] = placedName + "[type=double]"
                                            utils.tick_actions.set_block.AddBlockUpdate(socket)(world, socket, facingBlock, placedName + "[type=double]")
                                            updateSuccessful = true
                                        } else if (facingBlock.block == "air") {
                                            world.builds[hitBuildIndex].blocks[facingBlock.y - 2][facingBlock.z % 16][facingBlock.x % 16] = placedName
                                            utils.tick_actions.set_block.AddBlockUpdate(socket)(world, socket, facingBlock, placedName)
                                            updateSuccessful = true
                                        }
                                    }
                                }
                            } else socket.thisPlayer.tick.errorMessages.push("This block isn't available in all versions.")
                        } else if (placedName == "torch") {

                        } else if (placedName == "oak_stairs") {

                        } else if (placedName == "chest") {

                        } else if (placedName == "furnace") {

                        } else if (placedName == "ladder") {

                        } else if (placedName == "rail") {

                        } else if (placedName == "cobblestone_stairs") {

                        } else if (placedName == "lever") {

                        } else if (placedName == "stone_pressure_plate") {
                            
                        } else if (placedName == "oak_pressure_plate") {

                        } else if (placedName == "redstone_torch") {

                        } else if (placedName == "stone_button") {
                            
                        } else if (placedName == "snow_layer") {

                        } else if (placedName == "jukebox") {

                        } else if (placedName == "bucket") {

                        } else if (placedName == "water") {

                        } else if (placedName == "lava") {

                        } else if (placedName == "fire") {

                        } else if (placedName == "redstone_wire") {

                        } else if (placedName == "oak_sign") {

                        } else if (placedName == "oak_door") {

                        } else if (placedName == "iron_door") {

                        } else if (placedName == "wheat") {

                        } else if (placedName == "painting") {

                        } else if (placedName == "saddle") {

                        } else if (placedName == "chest_minecart") {

                        } else if (placedName == "furnace_minecart") {

                        } else {
                            console.log(facingBlock.block)
                            if (facingBlock.block == "air" && utils.player.CollidingWithBlock(socket)(socket, socket.thisPlayer.position, facingBlock) != "inside") {
                                if (validBlock) {
                                    world.builds[hitBuildIndex].blocks[facingBlock.y - 2][facingBlock.z % 16][facingBlock.x % 16] = placedName
                                    utils.tick_actions.set_block.AddBlockUpdate(socket)(world, socket, facingBlock, placedName)
                                    updateSuccessful = true
                                } else socket.thisPlayer.tick.errorMessages.push("This block isn't available in all versions.")
                            }
                        }
                    }
                }
            }

            if (!updateSuccessful) {
                var oldBlockUpdate = utils.tick_actions.set_block.GetBlockUpdate(socket)(world, {x: facingBlock.x, y: facingBlock.y, z: facingBlock.z})

                if (oldBlockUpdate == -1) {
                    var replaceBlock = 0
                    if (facingBlock.y < 64) {
                        replaceBlock = utils.registry.block.GetBlockID(world, socket.thisPlayer.selectedRegistries.block, utils.worldgen.GetBlock(socket)(world, socket, facingBlock))
                        if (typeof(replaceBlock) == "number") packetWriter.Block_Change(socket)(world, socket, facingBlock, replaceBlock, 0)
                        else packetWriter.Block_Change(socket)(world, socket, facingBlock, replaceBlock.id, replaceBlock.metadata)
                    }
                }
            } else {
                if (facingBlock.y > 1) {
                    for (var i = 0; i < world.loadedPlayers.length; i++) {
                        if (world.loadedPlayers[i].username != socket.thisPlayer.username && utils.player.CollidingWithBlock(socket)(socket, world.loadedPlayers[i].position, facingBlock) != "none") {
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

                world.builds[hitBuildIndex].lastModified = new Date().getTime()
                world.builds[hitBuildIndex].save = true
            }

            if (item.value < 256) packetWriter.Add_To_Inventory(socket)(world, socket, item.value, 1, 0)
        }

    }
    
    return splitIndex
}

module.exports = {ReadPacket}