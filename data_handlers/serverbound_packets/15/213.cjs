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
            var placedName = utils.registry.item.GetItemName(world, socket.thisPlayer.selectedRegistries.item, item.value)
            if (placedName == "water_bucket") placedName = "water"
            else if (placedName == "lava_bucket") placedName = "lava"
            else if (placedName == "flint_and_steel") placedName = "fire"
            else if (placedName == "redstone") placedName = "redstone_wire"
            else if (placedName == "wheat_seeds") placedName = "wheat"

            var validBlock = world.universalRegistries.block.includes(placedName) || !world.config.suppressNonUniversalBlocks
            var validEntity = false // Need to implement entity registry
            var originalBlock = {x: posX.value, y: posY.value, z: posZ.value}
            if (originalBlock.y < 2 || utils.math.NegMod(originalBlock.x, 32) < 16 || utils.math.NegMod(originalBlock.z, 32) < 16) originalBlock.block = "air"
            else originalBlock.block = utils.worldgen.GetBlock(socket)(world, socket, originalBlock)
            var facingBlock = {x: posX.value, y: posY.value, z: posZ.value}
            if (face.value == 0) facingBlock.y--
            else if (face.value == 1) facingBlock.y++
            else if (face.value == 2) facingBlock.z--
            else if (face.value == 3) facingBlock.z++
            else if (face.value == 4) facingBlock.x--
            else if (face.value == 5) facingBlock.x++
            facingBlock.block = utils.worldgen.GetBlock(socket)(world, socket, facingBlock)
            var facingBlockReplacable = utils.tag(world, facingBlock.block, "replaceable")

            var updateSuccessful = false
            var giveItem = false

            if (utils.math.NegMod(facingBlock.x, 32) >= 16 && utils.math.NegMod(facingBlock.z, 32) >= 16) {
                var hitBuildIndex = utils.builds.GetBuild(socket)(world, Math.floor(facingBlock.x / 32), Math.floor(facingBlock.z / 32))
                if (hitBuildIndex == undefined || world.builds[hitBuildIndex].creator == socket.thisPlayer.username) {
                    if (hitBuildIndex == undefined) {
                        hitBuildIndex = world.builds.length
                        world.builds.push(utils.builds.GenerateBuild(socket)(Math.floor(facingBlock.x / 32), Math.floor(facingBlock.z / 32), socket.thisPlayer.username, socket.thisPlayer.uvni, socket.thisPlayer.settings.defaultBuildSettings))
                    }

                    if (facingBlock.y <= 1) {
                        var chunkX = Math.floor(facingBlock.x / 16)
                        var chunkZ = Math.floor(facingBlock.z / 16)

                        if (utils.player.CollidingWithChunkLayer(socket)(socket, socket.thisPlayer.position, {x: chunkX, y: 1, z: chunkZ}) != "inside") {
                            if (validBlock) {
                                var prevFloor = world.builds[hitBuildIndex].floor
                                world.builds[hitBuildIndex].floor = placedName
                                world.builds[hitBuildIndex].lastModified = new Date().getTime()
                                world.builds[hitBuildIndex].save = true
                                for (var x = 0; x < 16; x++) {
                                    for (var z = 0; z < 16; z++) {
                                        var setX = chunkX * 16 + x
                                        var setZ = chunkZ * 16 + z
                                        utils.tick_actions.set_block.AddBlockUpdate(socket)(world, socket, {x: setX, y: 1, z: setZ}, placedName, false, prevFloor)
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
                        if (placedName == "smooth_stone_slab") {
                            if (validBlock) {
                                if (face.value == 1) {
                                    if (originalBlock.block == placedName) {
                                        if (utils.player.CollidingWithBlock(socket)(socket, socket.thisPlayer.position, originalBlock) != "inside") {
                                            world.builds[hitBuildIndex].blocks[originalBlock.y - 2][utils.math.NegMod(originalBlock.z, 16)][utils.math.NegMod(originalBlock.x, 16)] = placedName + "[type=double]"
                                            utils.tick_actions.set_block.AddBlockUpdate(socket)(world, socket, originalBlock, placedName + "[type=double]", false, originalBlock.block)
                                            if (facingBlockReplacable) packetWriter.Block_Change(socket)(world, socket, facingBlock, 0, 0, false)
                                            updateSuccessful = true
                                            giveItem = true
                                        }
                                    } else {
                                        if (facingBlockReplacable && utils.player.CollidingWithBlock(socket)(socket, socket.thisPlayer.position, facingBlock) != "inside") {
                                            world.builds[hitBuildIndex].blocks[facingBlock.y - 2][utils.math.NegMod(facingBlock.z, 16)][utils.math.NegMod(facingBlock.x, 16)] = placedName
                                            utils.tick_actions.set_block.AddBlockUpdate(socket)(world, socket, facingBlock, placedName, false, facingBlock.block)
                                            updateSuccessful = true
                                            giveItem = true
                                        }
                                    }
                                } else {
                                    if (utils.player.CollidingWithBlock(socket)(socket, socket.thisPlayer.position, facingBlock) != "inside") {
                                        if (facingBlock.block == placedName) {
                                            world.builds[hitBuildIndex].blocks[facingBlock.y - 2][utils.math.NegMod(facingBlock.z, 16)][utils.math.NegMod(facingBlock.x, 16)] = placedName + "[type=double]"
                                            utils.tick_actions.set_block.AddBlockUpdate(socket)(world, socket, facingBlock, placedName + "[type=double]", false, facingBlock.block)
                                            updateSuccessful = true
                                        } else if (facingBlockReplacable) {
                                            world.builds[hitBuildIndex].blocks[facingBlock.y - 2][utils.math.NegMod(facingBlock.z, 16)][utils.math.NegMod(facingBlock.x, 16)] = placedName
                                            utils.tick_actions.set_block.AddBlockUpdate(socket)(world, socket, facingBlock, placedName, false, facingBlock.block)
                                            updateSuccessful = true
                                            giveItem = true
                                        }
                                    }
                                }
                            } else socket.thisPlayer.tick.errorMessages.push("This block isn't available in all versions.")
                        } else if (placedName == "torch") {
                            if (validBlock) {
                                if (facingBlockReplacable) {
                                    if (face.value == 0 || face.value == 1) {
                                        world.builds[hitBuildIndex].blocks[facingBlock.y - 2][utils.math.NegMod(facingBlock.z, 16)][utils.math.NegMod(facingBlock.x, 16)] = placedName
                                        utils.tick_actions.set_block.AddBlockUpdate(socket)(world, socket, facingBlock, placedName, true, facingBlock.block)
                                    } else {
                                        var playerDirection = "???"
                                        if (face.value == 2) playerDirection = "north"
                                        else if (face.value == 3) playerDirection = "south"
                                        else if (face.value == 4) playerDirection = "west"
                                        else if (face.value == 5) playerDirection = "east"

                                        world.builds[hitBuildIndex].blocks[facingBlock.y - 2][utils.math.NegMod(facingBlock.z, 16)][utils.math.NegMod(facingBlock.x, 16)] = `wall_torch[facing=${playerDirection}]`
                                        utils.tick_actions.set_block.AddBlockUpdate(socket)(world, socket, facingBlock, `wall_torch[facing=${playerDirection}]`, true, facingBlock.block)
                                    }

                                    updateSuccessful = true
                                    giveItem = true
                                }
                            } else socket.thisPlayer.tick.errorMessages.push("This block isn't available in all versions.")
                        } else if (utils.tag(world, placedName, "stairs") || placedName == "chest" || placedName == "furnace") {
                            var playerDirection = utils.player.GetDirectionNESW(socket)(socket, socket.thisPlayer.rotation.yaw)

                            if (facingBlockReplacable) {
                                if (validBlock) {
                                    world.builds[hitBuildIndex].blocks[facingBlock.y - 2][utils.math.NegMod(facingBlock.z, 16)][utils.math.NegMod(facingBlock.x, 16)] = placedName + `[facing=${playerDirection}]`
                                    utils.tick_actions.set_block.AddBlockUpdate(socket)(world, socket, facingBlock, placedName + `[facing=${playerDirection}]`, true, facingBlock.block)
                                    updateSuccessful = true
                                } else socket.thisPlayer.tick.errorMessages.push("This block isn't available in all versions.")
                                giveItem = true
                            }
                        } else if (placedName == "ladder") {
                            var playerDirection = "???"

                            if (face.value == 0 || face.value == 1) playerDirection = utils.player.GetDirectionNESW(socket)(socket, socket.thisPlayer.rotation.yaw + 180)
                            else {
                                if (face.value == 2) playerDirection = "north"
                                else if (face.value == 3) playerDirection = "south"
                                else if (face.value == 4) playerDirection = "west"
                                else if (face.value == 5) playerDirection = "east"
                            }

                            if (validBlock) {
                                if (facingBlockReplacable) {
                                    world.builds[hitBuildIndex].blocks[facingBlock.y - 2][utils.math.NegMod(facingBlock.z, 16)][utils.math.NegMod(facingBlock.x, 16)] = placedName + `[facing=${playerDirection}]`
                                    utils.tick_actions.set_block.AddBlockUpdate(socket)(world, socket, facingBlock, placedName + `[facing=${playerDirection}]`, true, facingBlock.block)
                                    updateSuccessful = true
                                }
                            } else socket.thisPlayer.tick.errorMessages.push("This block isn't available in all versions.")
                            giveItem = true
                        } else if (placedName == "rail") {

                        } else if (placedName == "lever") {

                        } else if (placedName == "redstone_torch") {
                            if (validBlock) {
                                if (facingBlockReplacable) {
                                    if (face.value == 0 || face.value == 1) {
                                        world.builds[hitBuildIndex].blocks[facingBlock.y - 2][utils.math.NegMod(facingBlock.z, 16)][utils.math.NegMod(facingBlock.x, 16)] = placedName
                                        utils.tick_actions.set_block.AddBlockUpdate(socket)(world, socket, facingBlock, placedName, true, facingBlock.block)
                                    } else {
                                        var playerDirection = "???"
                                        if (face.value == 2) playerDirection = "north"
                                        else if (face.value == 3) playerDirection = "south"
                                        else if (face.value == 4) playerDirection = "west"
                                        else if (face.value == 5) playerDirection = "east"

                                        world.builds[hitBuildIndex].blocks[facingBlock.y - 2][utils.math.NegMod(facingBlock.z, 16)][utils.math.NegMod(facingBlock.x, 16)] = `redstone_wall_torch[facing=${playerDirection}]`
                                        utils.tick_actions.set_block.AddBlockUpdate(socket)(world, socket, facingBlock, `redstone_wall_torch[facing=${playerDirection}]`, true, facingBlock.block)
                                    }

                                    updateSuccessful = true
                                    giveItem = true
                                }
                            } else socket.thisPlayer.tick.errorMessages.push("This block isn't available in all versions.")
                        } else if (placedName == "stone_button") {
                            
                        } else if (placedName == "bucket") {
                            if (facingBlock.block == "water" || facingBlock.block == "lava") {
                                world.builds[hitBuildIndex].blocks[facingBlock.y - 2][utils.math.NegMod(facingBlock.z, 16)][utils.math.NegMod(facingBlock.x, 16)] = "air"
                                utils.tick_actions.set_block.AddBlockUpdate(socket)(world, socket, facingBlock, "air", false, facingBlock.block)
                                socket.thisPlayer.inventory.bucket_tracker.empty--
                                if (facingBlock.block == "water") socket.thisPlayer.inventory.bucket_tracker.water++
                                else socket.thisPlayer.inventory.bucket_tracker.lava++
                                updateSuccessful = true
                            }
                        } else if (placedName == "water") {
                            if (validBlock) {
                                if (facingBlockReplacable) {
                                    world.builds[hitBuildIndex].blocks[facingBlock.y - 2][utils.math.NegMod(facingBlock.z, 16)][utils.math.NegMod(facingBlock.x, 16)] = placedName
                                    utils.tick_actions.set_block.AddBlockUpdate(socket)(world, socket, facingBlock, placedName, false, facingBlock.block)
                                    socket.thisPlayer.inventory.bucket_tracker.water--
                                    socket.thisPlayer.inventory.bucket_tracker.empty++
                                    updateSuccessful = true
                                }
                            }
                        } else if (placedName == "lava") {
                            if (validBlock) {
                                if (facingBlockReplacable) {
                                    world.builds[hitBuildIndex].blocks[facingBlock.y - 2][utils.math.NegMod(facingBlock.z, 16)][utils.math.NegMod(facingBlock.x, 16)] = placedName
                                    utils.tick_actions.set_block.AddBlockUpdate(socket)(world, socket, facingBlock, placedName, false, facingBlock.block)
                                    socket.thisPlayer.inventory.bucket_tracker.lava--
                                    socket.thisPlayer.inventory.bucket_tracker.empty++
                                    updateSuccessful = true
                                }
                            }
                        } else if (placedName == "fire") {
                            if (validBlock) {
                                if (facingBlockReplacable) {
                                    world.builds[hitBuildIndex].blocks[facingBlock.y - 2][utils.math.NegMod(facingBlock.z, 16)][utils.math.NegMod(facingBlock.x, 16)] = placedName
                                    utils.tick_actions.set_block.AddBlockUpdate(socket)(world, socket, facingBlock, placedName, false, facingBlock.block)
                                    updateSuccessful = true
                                }
                            }
                        } else if (placedName == "oak_sign") {

                        } else if (utils.tag(world, placedName, "doors")) {
                            if (validBlock) {
                                if (facingBlockReplacable) {
                                    var aboveFacingBlock = utils.worldgen.GetBlock(socket)(world, socket, {x: facingBlock.x, y: facingBlock.y + 1, z: facingBlock.z})
                                    if (utils.tag(world, aboveFacingBlock, "replaceable")) {
                                        giveItem = true
                                        if (facingBlock.y < 63) {
                                            var playerFacing = utils.player.GetDirectionNESW(socket)(socket, socket.thisPlayer.rotation.yaw)

                                            var connectingDoorBlock = "air"
                                            if (playerFacing == "north") connectingDoorBlock = utils.worldgen.GetBlock(socket)(world, socket, {x: facingBlock.x - 1, y: facingBlock.y, z: facingBlock.z})
                                            else if (playerFacing == "east") connectingDoorBlock = utils.worldgen.GetBlock(socket)(world, socket, {x: facingBlock.x, y: facingBlock.y, z: facingBlock.z - 1})
                                            else if (playerFacing == "south") connectingDoorBlock = utils.worldgen.GetBlock(socket)(world, socket, {x: facingBlock.x + 1, y: facingBlock.y, z: facingBlock.z})
                                            else if (playerFacing == "west") connectingDoorBlock = utils.worldgen.GetBlock(socket)(world, socket, {x: facingBlock.x, y: facingBlock.y, z: facingBlock.z + 1})

                                            var reverseHinge = false
                                            if (utils.tag(world, connectingDoorBlock, "doors") && !connectingDoorBlock.includes('hinge=right') && ((playerFacing == "north" && !connectingDoorBlock.includes('facing=')) || (connectingDoorBlock.includes(`facing=${playerFacing}`)))) reverseHinge = true

                                            world.builds[hitBuildIndex].blocks[facingBlock.y - 2][utils.math.NegMod(facingBlock.z, 16)][utils.math.NegMod(facingBlock.x, 16)] = `${placedName}[facing=${playerFacing},hinge=${reverseHinge ? "right" : "left"},half=lower]`
                                            utils.tick_actions.set_block.AddBlockUpdate(socket)(world, socket, facingBlock, `${placedName}[facing=${playerFacing},hinge=${reverseHinge ? "right" : "left"},half=lower]`, true, facingBlock.block)

                                            world.builds[hitBuildIndex].blocks[facingBlock.y - 1][utils.math.NegMod(facingBlock.z, 16)][utils.math.NegMod(facingBlock.x, 16)] = `${placedName}[facing=${playerFacing},hinge=${reverseHinge ? "right" : "left"},half=upper]`
                                            utils.tick_actions.set_block.AddBlockUpdate(socket)(world, socket, {x: facingBlock.x, y: facingBlock.y + 1, z: facingBlock.z}, `${placedName}[facing=${playerFacing},hinge=${reverseHinge ? "right" : "left"},half=upper]`, true, aboveFacingBlock)

                                            updateSuccessful = true
                                        }
                                    }
                                }
                            }
                        } else if (placedName == "wheat") {
                            if (validBlock) {
                                if (originalBlock.block.startsWith('wheat')) {
                                    var newBlock = placedName
                                    if (originalBlock.block == `${placedName}`) newBlock = `${placedName}[age=1]`
                                    if (originalBlock.block == `${placedName}[age=0]`) newBlock = `${placedName}[age=1]`
                                    if (originalBlock.block == `${placedName}[age=1]`) newBlock = `${placedName}[age=2]`
                                    if (originalBlock.block == `${placedName}[age=2]`) newBlock = `${placedName}[age=3]`
                                    if (originalBlock.block == `${placedName}[age=3]`) newBlock = `${placedName}[age=4]`
                                    if (originalBlock.block == `${placedName}[age=4]`) newBlock = `${placedName}[age=5]`
                                    if (originalBlock.block == `${placedName}[age=5]`) newBlock = `${placedName}[age=6]`
                                    if (originalBlock.block == `${placedName}[age=6]`) newBlock = `${placedName}[age=7]`

                                    world.builds[hitBuildIndex].blocks[originalBlock.y - 2][utils.math.NegMod(originalBlock.z, 16)][utils.math.NegMod(originalBlock.x, 16)] = newBlock
                                    utils.tick_actions.set_block.AddBlockUpdate(socket)(world, socket, originalBlock, newBlock, true, originalBlock.block)
                                    updateSuccessful = true
                                }
                                else {
                                    giveItem = true
                                    if (facingBlockReplacable && utils.player.CollidingWithBlock(socket)(socket, socket.thisPlayer.position, facingBlock) != "inside") {
                                        world.builds[hitBuildIndex].blocks[facingBlock.y - 2][utils.math.NegMod(facingBlock.z, 16)][utils.math.NegMod(facingBlock.x, 16)] = placedName
                                        utils.tick_actions.set_block.AddBlockUpdate(socket)(world, socket, facingBlock, placedName, false, facingBlock.block)
                                        updateSuccessful = true
                                    }
                                }
                            } else socket.thisPlayer.tick.errorMessages.push("This block isn't available in all versions.")
                        } else if (placedName == "painting") {

                        } else if (placedName == "saddle") {

                        } else if (placedName == "chest_minecart") {

                        } else if (placedName == "furnace_minecart") {

                        } else {
                            if (facingBlockReplacable && utils.player.CollidingWithBlock(socket)(socket, socket.thisPlayer.position, facingBlock) != "inside") {
                                if (validBlock) {
                                    world.builds[hitBuildIndex].blocks[facingBlock.y - 2][utils.math.NegMod(facingBlock.z, 16)][utils.math.NegMod(facingBlock.x, 16)] = placedName
                                    utils.tick_actions.set_block.AddBlockUpdate(socket)(world, socket, facingBlock, placedName, false, facingBlock.block)
                                    updateSuccessful = true
                                } else socket.thisPlayer.tick.errorMessages.push("This block isn't available in all versions.")
                                giveItem = true
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
                        if (typeof(replaceBlock) == "number") packetWriter.Block_Change(socket)(world, socket, facingBlock, replaceBlock, 0, false)
                        else packetWriter.Block_Change(socket)(world, socket, facingBlock, replaceBlock.id, replaceBlock.metadata, false)
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

            if (giveItem) packetWriter.Add_To_Inventory(socket)(world, socket, item.value, 1, 0)
        }

    }
    
    return splitIndex
}

module.exports = {ReadPacket}