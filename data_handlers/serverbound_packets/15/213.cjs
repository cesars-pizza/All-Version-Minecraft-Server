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
            if (!facingBlockReplacable) {
                if (utils.registry.block.GetBlockID(world, socket.thisPlayer.selectedRegistries.block, facingBlock.block) == 0) facingBlockReplacable = true
            }

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
                                utils.tick_actions.set_block.AddFloorUpdate(socket)(world, socket, facingBlock, placedName, false)
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
                                            utils.tick_actions.set_block.AddBlockUpdate(socket)(world, socket, originalBlock, placedName + "[type=double]", false, originalBlock.block)
                                            if (facingBlockReplacable) packetWriter.Alpha.Block_Change(socket)(world, socket, facingBlock, 0, 0, false)
                                            updateSuccessful = true
                                            giveItem = true
                                        }
                                    } else {
                                        if (facingBlockReplacable && utils.player.CollidingWithBlock(socket)(socket, socket.thisPlayer.position, facingBlock) != "inside") {
                                            utils.tick_actions.set_block.AddBlockUpdate(socket)(world, socket, facingBlock, placedName, false, facingBlock.block)
                                            updateSuccessful = true
                                            giveItem = true
                                        }
                                    }
                                } else {
                                    if (utils.player.CollidingWithBlock(socket)(socket, socket.thisPlayer.position, facingBlock) != "inside") {
                                        if (facingBlock.block == placedName) {
                                            utils.tick_actions.set_block.AddBlockUpdate(socket)(world, socket, facingBlock, placedName + "[type=double]", false, facingBlock.block)
                                            updateSuccessful = true
                                        } else if (facingBlockReplacable) {
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
                                        utils.tick_actions.set_block.AddBlockUpdate(socket)(world, socket, facingBlock, placedName, true, facingBlock.block)
                                    } else {
                                        var playerDirection = "???"
                                        if (face.value == 2) playerDirection = "north"
                                        else if (face.value == 3) playerDirection = "south"
                                        else if (face.value == 4) playerDirection = "west"
                                        else if (face.value == 5) playerDirection = "east"

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
                                    utils.tick_actions.set_block.AddBlockUpdate(socket)(world, socket, facingBlock, placedName + `[facing=${playerDirection}]`, true, facingBlock.block)
                                    updateSuccessful = true
                                }
                            } else socket.thisPlayer.tick.errorMessages.push("This block isn't available in all versions.")
                            giveItem = true
                        } else if (placedName == "rail") {
                            var playerDirection = utils.player.GetDirectionNESW(socket)(socket, socket.thisPlayer.rotation.yaw)

                            if (playerDirection == "east" || playerDirection == "west") playerDirection = "east_west"
                            else playerDirection = "north_south"

                            if (facingBlockReplacable) {
                                if (validBlock) {
                                    utils.tick_actions.set_block.AddBlockUpdate(socket)(world, socket, facingBlock, placedName + `[shape=${playerDirection}]`, true, facingBlock.block)
                                    updateSuccessful = true
                                } else socket.thisPlayer.tick.errorMessages.push("This block isn't available in all versions.")
                                giveItem = true
                            }
                        } else if (placedName == "lever") {
                            var playerDirectionFlipped = face.value != 1
                            var playerDirection = utils.player.GetDirectionNESW(socket)(socket, socket.thisPlayer.rotation.yaw + (playerDirectionFlipped ? 180 : 0))
                            
                            var playerWall = "north"
                            if (face.value == 3) playerWall = "south"
                            else if (face.value == 4) playerWall = "west"
                            else if (face.value == 5) playerWall = "east"

                            var placedFace = "wall"
                            if (face.value == 1) placedFace = "floor"
                            else if (face.value > 1) playerDirection = playerWall

                            if (facingBlockReplacable) {
                                if (validBlock) {
                                    utils.tick_actions.set_block.AddBlockUpdate(socket)(world, socket, facingBlock, placedName + `[facing=${playerDirection},face=${placedFace}]`, false, facingBlock.block)
                                    updateSuccessful = true
                                } else socket.thisPlayer.tick.errorMessages.push("This block isn't available in all versions.")
                                giveItem = true
                            }
                        } else if (placedName == "stone_button") {
                            var playerDirection = utils.player.GetDirectionNESW(socket)(socket, socket.thisPlayer.rotation.yaw + 180)
                            
                            var playerWall = "north"
                            if (face.value == 3) playerWall = "south"
                            else if (face.value == 4) playerWall = "west"
                            else if (face.value == 5) playerWall = "east"

                            var placedFace = "wall"
                            if (face.value > 1) playerDirection = playerWall

                            if (facingBlockReplacable) {
                                if (validBlock) {
                                    utils.tick_actions.set_block.AddBlockUpdate(socket)(world, socket, facingBlock, placedName + `[facing=${playerDirection},face=${placedFace}]`, false, facingBlock.block)
                                    updateSuccessful = true
                                } else socket.thisPlayer.tick.errorMessages.push("This block isn't available in all versions.")
                                giveItem = true
                            }
                        } else if (placedName == "redstone_torch") {
                            if (validBlock) {
                                if (facingBlockReplacable) {
                                    if (face.value == 0 || face.value == 1) {
                                        utils.tick_actions.set_block.AddBlockUpdate(socket)(world, socket, facingBlock, placedName, true, facingBlock.block)
                                    } else {
                                        var playerDirection = "???"
                                        if (face.value == 2) playerDirection = "north"
                                        else if (face.value == 3) playerDirection = "south"
                                        else if (face.value == 4) playerDirection = "west"
                                        else if (face.value == 5) playerDirection = "east"

                                        utils.tick_actions.set_block.AddBlockUpdate(socket)(world, socket, facingBlock, `redstone_wall_torch[facing=${playerDirection}]`, true, facingBlock.block)
                                    }

                                    updateSuccessful = true
                                    giveItem = true
                                }
                            } else socket.thisPlayer.tick.errorMessages.push("This block isn't available in all versions.")
                        } else if (placedName == "bucket") {
                            if (facingBlock.block == "water" || facingBlock.block == "lava") {
                                utils.tick_actions.set_block.AddBlockUpdate(socket)(world, socket, facingBlock, "air", false, facingBlock.block)
                                socket.thisPlayer.inventory.bucket_tracker.empty--
                                if (facingBlock.block == "water") socket.thisPlayer.inventory.bucket_tracker.water++
                                else socket.thisPlayer.inventory.bucket_tracker.lava++
                                updateSuccessful = true
                            }
                        } else if (placedName == "water") {
                            if (validBlock) {
                                if (facingBlockReplacable) {
                                    utils.tick_actions.set_block.AddBlockUpdate(socket)(world, socket, facingBlock, placedName, false, facingBlock.block)
                                    socket.thisPlayer.inventory.bucket_tracker.water--
                                    socket.thisPlayer.inventory.bucket_tracker.empty++
                                    updateSuccessful = true
                                }
                            }
                        } else if (placedName == "lava") {
                            if (validBlock) {
                                if (facingBlockReplacable) {
                                    utils.tick_actions.set_block.AddBlockUpdate(socket)(world, socket, facingBlock, placedName, false, facingBlock.block)
                                    socket.thisPlayer.inventory.bucket_tracker.lava--
                                    socket.thisPlayer.inventory.bucket_tracker.empty++
                                    updateSuccessful = true
                                }
                            }
                        } else if (placedName == "fire") {
                            if (validBlock) {
                                if (facingBlockReplacable) {
                                    utils.tick_actions.set_block.AddBlockUpdate(socket)(world, socket, facingBlock, placedName, false, facingBlock.block)
                                    updateSuccessful = true
                                }
                            }
                        } else if (placedName == "oak_sign") {
                            if (facingBlockReplacable) {
                                if (validBlock) {
                                    if (face.value > 1) {
                                        var playerDirection = "north"
                                        if (face.value == 3) playerDirection = "south"
                                        if (face.value == 4) playerDirection = "west"
                                        if (face.value == 5) playerDirection = "east"

                                        utils.tick_actions.set_block.AddBlockUpdate(socket)(world, socket, facingBlock, `oak_wall_sign[facing=${playerDirection}]`, true, facingBlock.block)
                                        updateSuccessful = true
                                    } else {
                                        var playerDirection = utils.player.GetDirection16Num(socket)(socket, socket.thisPlayer.rotation.yaw + 180)

                                        utils.tick_actions.set_block.AddBlockUpdate(socket)(world, socket, facingBlock, `oak_sign[rotation=${playerDirection}]`, true, facingBlock.block)
                                        updateSuccessful = true
                                    }
                                } else socket.thisPlayer.tick.errorMessages.push("This block isn't available in all versions.")
                                giveItem = true
                            }
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

                                            utils.tick_actions.set_block.AddBlockUpdate(socket)(world, socket, facingBlock, `${placedName}[facing=${playerFacing},hinge=${reverseHinge ? "right" : "left"},half=lower]`, true, facingBlock.block)

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

                                    utils.tick_actions.set_block.AddBlockUpdate(socket)(world, socket, originalBlock, newBlock, true, originalBlock.block)
                                    updateSuccessful = true
                                }
                                else {
                                    giveItem = true
                                    if (facingBlockReplacable && utils.player.CollidingWithBlock(socket)(socket, socket.thisPlayer.position, facingBlock) != "inside") {
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
                        if (typeof(replaceBlock) == "number") packetWriter.Alpha.Block_Change(socket)(world, socket, facingBlock, replaceBlock, 0, false)
                        else packetWriter.Alpha.Block_Change(socket)(world, socket, facingBlock, replaceBlock.id, replaceBlock.metadata, false)
                    } else packetWriter.Alpha.Block_Change(socket)(world, socket, facingBlock, 0, 0, false)
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
            }

            if (giveItem) packetWriter.Alpha.Add_To_Inventory(socket)(world, socket, item.value, 1, 0)
        }

    }
    
    return splitIndex
}

module.exports = {ReadPacket}