const {Socket, World} = require('../../../data_structures.cjs')
const dataReader = require('../../data_reader.cjs')
const packetWriter = require('../../clientbound_packets/packet_writer.cjs')
const utils = require('../../../utils/utils.cjs')

var packetID = 13
var packetIdentifier = "Player Position And Look"

/** 
 * @param {World} world 
 * @param {Socket} socket 
 * @param {Buffer} data 
 */
function ReadPacket(world, socket, data) {
    var splitIndex = data.length - 42

    socket.log(`SERVERBOUND --> ${packetID} "${packetIdentifier}" / ${data.length} bytes`, false)
    
    if (splitIndex >= 0) {

        var position = {}
        position.x = dataReader.readDouble(socket, data, 1)
        position.y = dataReader.readDouble(socket, data, position.x.nextPos)
        position.stance = dataReader.readDouble(socket, data, position.y.nextPos)
        position.z = dataReader.readDouble(socket, data, position.stance.nextPos)
        var rotation = {}
        rotation.yaw = dataReader.readFloat(socket, data, position.z.nextPos)
        rotation.pitch = dataReader.readFloat(socket, data, rotation.yaw.nextPos)

        var onGround = dataReader.readBool(socket, data, rotation.pitch.nextPos)

        if (socket.disconnect == "" && !socket.thisPlayer.tick.teleportSelf && socket.thisPlayer.allowMovement) {
            var newPosition = {x: position.x.value, y: position.y.value, z: position.z.value}
            var newPositionShifted = newPosition

            if ((position.x.value == 8.5 && position.y.value == 65 && position.z.value == 8.5) || position.y.value < 1) {
                socket.thisPlayer.tick.teleportSelf = true
            
                var secondInvHasValidBlock = false
                if (socket.thisPlayer.joinCount % 2 == 0) {
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("chest")) packetWriter.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "chest"), 64); secondInvHasValidBlock = true
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("redstone_wire")) packetWriter.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "redstone"), 64); secondInvHasValidBlock = true
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("diamond_ore")) packetWriter.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "diamond_ore"), 64); secondInvHasValidBlock = true
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("diamond_block")) packetWriter.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "diamond_block"), 64); secondInvHasValidBlock = true
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("crafting_table")) packetWriter.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "crafting_table"), 64); secondInvHasValidBlock = true
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("wheat")) packetWriter.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "wheat_seeds"), 64); secondInvHasValidBlock = true
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("farmland")) packetWriter.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "farmland"), 64); secondInvHasValidBlock = true
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("furnace")) packetWriter.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "furnace"), 64); secondInvHasValidBlock = true
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("oak_sign")) packetWriter.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "oak_sign"), 1); secondInvHasValidBlock = true
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("oak_door")) packetWriter.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "oak_door"), 1); secondInvHasValidBlock = true
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("ladder")) packetWriter.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "ladder"), 64); secondInvHasValidBlock = true
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("rail")) packetWriter.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "rail"), 64); secondInvHasValidBlock = true
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("cobblestone_stairs")) packetWriter.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "cobblestone_stairs"), 64); secondInvHasValidBlock = true
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("lever")) packetWriter.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "lever"), 64); secondInvHasValidBlock = true
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("stone_pressure_plate")) packetWriter.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "stone_pressure_plate"), 64); secondInvHasValidBlock = true
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("iron_door")) packetWriter.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "iron_door"), 1); secondInvHasValidBlock = true
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("oak_pressure_plate")) packetWriter.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "oak_pressure_plate"), 64); secondInvHasValidBlock = true
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("redstone_ore")) packetWriter.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "redstone_ore"), 64); secondInvHasValidBlock = true
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("redstone_torch")) packetWriter.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "redstone_torch"), 64); secondInvHasValidBlock = true
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("stone_button")) packetWriter.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "stone_button"), 64); secondInvHasValidBlock = true
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("snow")) packetWriter.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "snow"), 64); secondInvHasValidBlock = true
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("ice")) packetWriter.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "ice"), 64); secondInvHasValidBlock = true
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("snow_block")) packetWriter.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "snow_block"), 64); secondInvHasValidBlock = true
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("cactus")) packetWriter.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "cactus"), 64); secondInvHasValidBlock = true
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("clay")) packetWriter.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "clay"), 64); secondInvHasValidBlock = true
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("sugar_cane")) packetWriter.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "sugar_cane"), 64); secondInvHasValidBlock = true
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("jukebox")) packetWriter.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "jukebox"), 64); secondInvHasValidBlock = true
                    packetWriter.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "painting"), 64)
                    packetWriter.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "minecart"), 1)
                    packetWriter.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "saddle"), 1)
                    packetWriter.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "chest_minecart"), 1)
                    packetWriter.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "furnace_minecart"), 1)
                }
                
                if (socket.thisPlayer.joinCount % 2 == 1 || !secondInvHasValidBlock) {
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("stone")) packetWriter.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "stone"), 64)
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("grass_block")) packetWriter.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "grass_block"), 64)
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("dirt")) packetWriter.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "dirt"), 64)
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("cobblestone")) packetWriter.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "cobblestone"), 64)
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("oak_planks")) packetWriter.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "oak_planks"), 64)
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("oak_sapling")) packetWriter.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "oak_sapling"), 64)
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("bedrock")) packetWriter.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "bedrock"), 64)
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("water")) packetWriter.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "water_bucket"), 1)
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("lava")) packetWriter.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "lava_bucket"), 1)
                    packetWriter.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "bucket"), 1)
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("sand")) packetWriter.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "sand"), 64)
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("gravel")) packetWriter.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "gravel"), 64)
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("gold_ore")) packetWriter.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "gold_ore"), 64)
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("iron_ore")) packetWriter.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "iron_ore"), 64)
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("coal_ore")) packetWriter.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "coal_ore"), 64)
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("oak_log")) packetWriter.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "oak_log"), 64)
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("oak_leaves")) packetWriter.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "oak_leaves"), 64)
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("sponge")) packetWriter.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "sponge"), 64)
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("glass")) packetWriter.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "glass"), 64)
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("white_wool")) packetWriter.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "white_wool"), 64)
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("dandelion")) packetWriter.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "dandelion"), 64)
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("poppy")) packetWriter.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "poppy"), 64)
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("brown_mushroom")) packetWriter.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "brown_mushroom"), 64)
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("red_mushroom")) packetWriter.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "red_mushroom"), 64)
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("gold_block")) packetWriter.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "gold_block"), 64)
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("iron_block")) packetWriter.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "iron_block"), 64)
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("smooth_stone_slab")) packetWriter.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "smooth_stone_slab"), 64)
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("bricks")) packetWriter.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "bricks"), 64)
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("tnt")) packetWriter.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "tnt"), 64)
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("bookshelf")) packetWriter.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "bookshelf"), 64)
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("mossy_cobblestone")) packetWriter.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "mossy_cobblestone"), 64)
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("obsidian")) packetWriter.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "obsidian"), 64)
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("torch")) packetWriter.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "torch"), 64)
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("fire")) packetWriter.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "flint_and_steel"), 1)
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("spawner")) packetWriter.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "spawner"), 64)
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("oak_stairs")) packetWriter.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "oak_stairs"), 64)
                }
                return
            }

            var difX = socket.thisPlayer.position.x != newPositionShifted.x
            var difY = socket.thisPlayer.position.y != newPositionShifted.y
            var difZ = socket.thisPlayer.position.z != newPositionShifted.z
            var difPitch = socket.thisPlayer.rotation.pitch != rotation.pitch.value
            var difYaw = socket.thisPlayer.rotation.yaw != rotation.yaw.value

            if (difX || difY || difZ) {
                socket.thisPlayer.tick.position = true
                utils.player.GetPlayer(socket)(world, socket, socket.thisPlayer.username).save = true
            }
            if (difPitch || difYaw) {
                socket.thisPlayer.tick.rotation = true
                utils.player.GetPlayer(socket)(world, socket, socket.thisPlayer.username).save = true
            }

            if (difX || difZ) {
                var prevChunk = {x: Math.floor(socket.thisPlayer.position.x / 16), z: Math.floor(socket.thisPlayer.position.z / 16)}
                var newChunk = {x: Math.floor(newPositionShifted.x / 16), z: Math.floor(newPositionShifted.z / 16)}

                if (prevChunk.x != newChunk.x || prevChunk.z != newChunk.z) {
                    utils.world_packets.GenerateRenderDistance(socket)(world, socket, 10, newChunk.x, newChunk.z, prevChunk.x, prevChunk.z)
                }

                if (socket.thisPlayer.settings.showPlotInfo) {
                    var prevInBuild = socket.thisPlayer.position.x % 32 >= 16 && socket.thisPlayer.position.z % 32 >= 16
                    var currInBuild = newPositionShifted.x % 32 >= 16 && newPositionShifted.z % 32 >= 16
                    if (!prevInBuild && currInBuild) {
                        var build = utils.builds.GetBuild(socket)(world, Math.floor(newPositionShifted.x / 32), Math.floor(newPositionShifted.z / 32))
                        if (build != undefined && world.builds[build].creator != socket.thisPlayer.username) {
                            var buildInfo = utils.builds.GetBuildInfo(socket)(world, socket, Math.floor(newPositionShifted.x / 32), Math.floor(newPositionShifted.z / 32))
                            for (var i = 0; i < buildInfo.length; i++) {
                                packetWriter.Message(socket)(socket, 0, buildInfo[i])
                            }
                        }
                    }
                }
            }

            socket.thisPlayer.position = newPositionShifted
            socket.thisPlayer.rotation = {pitch: rotation.pitch.value, yaw: rotation.yaw.value}
        }
    }
    
    return splitIndex
}

module.exports = {ReadPacket}