const {Socket, World} = require('../../../data_structures.cjs')
const dataReader = require('../../data_reader.cjs')
const packetWriter = require('../../clientbound_packets/packet_writer.cjs')
const utils = require('../../../utils/utils.cjs')
const { HexViewBytes } = require('../../../server.cjs')

var packetID = 14
var packetIdentifier = "Player Digging"

/** 
 * @param {World} world 
 * @param {Socket} socket 
 * @param {Buffer} data 
 */
function ReadPacket(world, socket, data) {
    var splitIndex = data.length - 12

    socket.log(`SERVERBOUND --> ${packetID} "${packetIdentifier}" / ${data.length} bytes`)

    if (splitIndex >= 0) {
        var status = dataReader.readByte(socket, data, 1)
        var blockPosRaw = {}
        blockPosRaw.x = dataReader.readInt(socket, data, status.nextPos)
        blockPosRaw.y = dataReader.readByte(socket, data, blockPosRaw.x.nextPos)
        blockPosRaw.z = dataReader.readInt(socket, data, blockPosRaw.y.nextPos)
        var face = dataReader.readByte(socket, data, blockPosRaw.z.nextPos)
        
        if (socket.disconnect == "") {
            var blockPos = {x: blockPosRaw.x.value, y: blockPosRaw.y.value, z: blockPosRaw.z.value}
            var updateSuccessful = false

            var prevBlock = utils.worldgen.GetBlock(socket)(world, socket, blockPos)

            if (status.value == 2) {
                socket.thisPlayer.digging.ticks = 0
                blockPos = socket.thisPlayer.digging.blockPos
                prevBlock = utils.worldgen.GetBlock(socket)(world, socket, blockPos)

                if (utils.math.NegMod(blockPos.x, 32) >= 16 && utils.math.NegMod(blockPos.z, 32) >= 16) {
                    var hitBuildIndex = utils.builds.GetBuild(socket)(world, Math.floor(blockPos.x / 32), Math.floor(blockPos.z / 32))

                    if (hitBuildIndex != undefined) {
                        if (world.builds[hitBuildIndex].creator == socket.thisPlayer.username) {
                            if (prevBlock.startsWith("furnace")) {
                                var lit = prevBlock.includes('lit=true')

                                utils.builds.SetBlockInBuild(socket)(world, hitBuildIndex, blockPos, `furnace[lit=${!lit}]`)
                                utils.tick_actions.set_block.AddBlockUpdate(socket)(world, socket, blockPos, `furnace[lit=${!lit}]`, false, prevBlock)

                                world.builds[hitBuildIndex].lastModified = new Date().getTime()
                                world.builds[hitBuildIndex].save = true
                            }
                        }

                        if (world.builds[hitBuildIndex].creator == socket.thisPlayer.username || world.builds[hitBuildIndex].settings.publicInteractions) {
                            if (prevBlock.startsWith("oak_door")) {
                                var open = prevBlock.includes('open=true')
                                var half = prevBlock.includes('half=upper') ? "upper" : "lower"
                                var hinge = prevBlock.includes('hinge=right') ? "right" : "left"
                                var facing = "north"
                                if (prevBlock.includes('facing=east')) facing = "east"
                                else if (prevBlock.includes('facing=south')) facing = "south"
                                else if (prevBlock.includes('facing=west')) facing = "west"

                                var newBlock = `oak_door[facing=${facing},hinge=${hinge},half=${half},open=${!open}]`

                                utils.builds.SetBlockInBuild(socket)(world, hitBuildIndex, blockPos, newBlock)
                                utils.tick_actions.set_block.AddBlockUpdate(socket)(world, socket, blockPos, newBlock, false, prevBlock)

                                world.builds[hitBuildIndex].lastModified = new Date().getTime()
                                world.builds[hitBuildIndex].save = true
                            } else if (prevBlock.startsWith("lever")) {
                                var powered = prevBlock.includes('powered=true')
                                var face = "wall"
                                if (prevBlock.includes('facing=ceiling')) facing = "ceiling"
                                else if (prevBlock.includes('facing=floor')) facing = "floor"
                                var facing = "north"
                                if (prevBlock.includes('facing=east')) facing = "east"
                                else if (prevBlock.includes('facing=south')) facing = "south"
                                else if (prevBlock.includes('facing=west')) facing = "west"

                                var newBlock = `lever[facing=${facing},face=${face},powered=${!powered}]`

                                utils.builds.SetBlockInBuild(socket)(world, hitBuildIndex, blockPos, newBlock)
                                utils.tick_actions.set_block.AddBlockUpdate(socket)(world, socket, blockPos, newBlock, false, prevBlock)

                                world.builds[hitBuildIndex].lastModified = new Date().getTime()
                                world.builds[hitBuildIndex].save = true
                            } else if (prevBlock.startsWith("stone_button")) {
                                var powered = prevBlock.includes('powered=true')
                                var face = "wall"
                                if (prevBlock.includes('facing=ceiling')) facing = "ceiling"
                                else if (prevBlock.includes('facing=floor')) facing = "floor"
                                var facing = "north"
                                if (prevBlock.includes('facing=east')) facing = "east"
                                else if (prevBlock.includes('facing=south')) facing = "south"
                                else if (prevBlock.includes('facing=west')) facing = "west"

                                if (powered == false) {
                                    var newBlock = `stone_button[facing=${facing},face=${face},powered=${!powered}]`

                                    utils.builds.SetBlockInBuild(socket)(world, hitBuildIndex, blockPos, newBlock)
                                    utils.tick_actions.set_block.AddBlockUpdate(socket)(world, socket, blockPos, newBlock, false, prevBlock)

                                    world.builds[hitBuildIndex].lastModified = new Date().getTime()
                                    world.builds[hitBuildIndex].save = true
                                }
                            }
                        } else {
                            if (prevBlock.startsWith('oak_door') || prevBlock.startsWith('lever') || prevBlock.startsWith('stone_button')) {
                                var blockID = utils.registry.block.GetBlockID(world, socket.thisPlayer.selectedRegistries.block, prevBlock)
                                if (typeof(blockID) == "number") packetWriter.Alpha.Block_Change(socket)(world, socket, blockPos, blockID, 0, false)
                                else packetWriter.Alpha.Block_Change(socket)(world, socket, blockPos, blockID.id, blockID.metadata, false)
                            }
                        }
                    }
                }
            }
            else if (status.value == 3) socket.thisPlayer.digging = {
                blockPos: blockPos,
                ticks: 999
            }
            else if (blockPos.x == socket.thisPlayer.digging.blockPos.x && blockPos.y == socket.thisPlayer.digging.blockPos.y && blockPos.z == socket.thisPlayer.digging.blockPos.z) socket.thisPlayer.digging.ticks++
            else socket.thisPlayer.digging = {
                blockPos: blockPos,
                ticks: 1
            }

            if (utils.math.NegMod(blockPos.x, 32) >= 16 && utils.math.NegMod(blockPos.z, 32) >= 16 && socket.thisPlayer.digging.ticks >= 6) {

                var hitBuildIndex = utils.builds.GetBuild(socket)(world, Math.floor(blockPos.x / 32), Math.floor(blockPos.z / 32))
                if (hitBuildIndex == undefined || world.builds[hitBuildIndex].creator == socket.thisPlayer.username) {
                    if (hitBuildIndex == undefined) {
                        hitBuildIndex = world.builds.length
                        world.builds.push(utils.builds.GenerateBuild(socket)(Math.floor(blockPos.x / 32), Math.floor(blockPos.z / 32), socket.thisPlayer.username, socket.thisPlayer.uvni, socket.thisPlayer.settings.defaultBuildSettings))
                    }

                    if (blockPos.y <= 1) {
                        var chunkX = Math.floor(blockPos.x / 16)
                        var chunkZ = Math.floor(blockPos.z / 16)

                        if (socket.thisPlayer.floorChangeCooldown == 0 && utils.player.CollidingWithChunkLayer(socket)(socket, socket.thisPlayer.position, {x: chunkX, y: 1, z: chunkZ}) != "inside") {
                            socket.thisPlayer.floorChangeCooldown = 5
                            
                            var floorID = world.universalRegistries.block.indexOf(world.builds[hitBuildIndex].floor)
                            var prevFloorID = floorID
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

                                    if (typeof(thisRegistryFloorID) == "number") utils.tick_actions.set_block.AddBlockUpdate(socket)(world, socket, {x: setX, y: 1, z: setZ}, thisRegistryFloorID, false, prevFloorID)
                                    else utils.tick_actions.set_block.AddBlockUpdate(socket)(world, socket, {x: setX, y: 1, z: setZ}, `${thisRegistryFloorID.id}:${thisRegistryFloorID.metadata}`, false, prevFloorID)
                                }
                            }
                            if (blockPos.y == 1) updateSuccessful = true

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
                    } else if (blockPos.y < 64) {
                        world.builds[hitBuildIndex].blocks[blockPos.y - 2][utils.math.NegMod(blockPos.z, 16)][utils.math.NegMod(blockPos.x, 16)] = "air"
                        utils.tick_actions.set_block.AddBlockUpdate(socket)(world, socket, blockPos, 0, false, prevBlock)
                        if (utils.tag(world, prevBlock, "doors")) {
                            if (!prevBlock.includes('half=upper') && blockPos.y < 63) {
                                world.builds[hitBuildIndex].blocks[blockPos.y - 1][utils.math.NegMod(blockPos.z, 16)][utils.math.NegMod(blockPos.x, 16)] = "air"
                                if (!prevBlock.includes('[')) prevBlock = prevBlock + '[half=lower]'
                                else if (!prevBlock.includes('half=lower')) prevBlock = prevBlock.replace(']', ',half=lower]')
                                utils.tick_actions.set_block.AddBlockUpdate(socket)(world, socket, {x: blockPos.x, y: blockPos.y + 1, z: blockPos.z}, 0, false, prevBlock.replace('half=lower', 'half=upper'))
                            } else if (prevBlock.includes('half=upper') && blockPos.y > 2) {
                                world.builds[hitBuildIndex].blocks[blockPos.y - 3][utils.math.NegMod(blockPos.z, 16)][utils.math.NegMod(blockPos.x, 16)] = "air"
                                utils.tick_actions.set_block.AddBlockUpdate(socket)(world, socket, {x: blockPos.x, y: blockPos.y - 1, z: blockPos.z}, 0, false, prevBlock.replace('half=upper', 'half=lower'))
                            }
                        }
                        world.builds[hitBuildIndex].lastModified = new Date().getTime()
                        world.builds[hitBuildIndex].save = true
                        updateSuccessful = true
                    }
                }
            }

            if (!updateSuccessful && blockPos.y < 64 && status.value == 3) {
                var oldBlockUpdate = utils.tick_actions.set_block.GetBlockUpdate(socket)(world, {x: blockPos.x, y: blockPos.y, z: blockPos.z})

                if (oldBlockUpdate == -1) {
                    var replacementBlock = utils.registry.block.GetBlockID(world, socket.thisPlayer.selectedRegistries.block, utils.worldgen.GetBlock(socket)(world, socket, blockPos))
                    if (typeof(replacementBlock) == "number") packetWriter.Alpha.Block_Change(socket)(world, socket, blockPos, replacementBlock, 0, false)
                    else packetWriter.Alpha.Block_Change(socket)(world, socket, blockPos, replacementBlock.id, replacementBlock.metadata, false)
                }
            }
        }

    }
    
    return splitIndex
}

module.exports = {ReadPacket}