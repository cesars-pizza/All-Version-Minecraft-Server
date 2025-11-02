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

        var newPosition = {x: position.x.value, y: position.y.value, z: position.z.value}
        var newRotation = {pitch: rotation.pitch.value, yaw: rotation.yaw.value}

        if (socket.disconnect == "" && !socket.thisPlayer.tick.teleportSelf && socket.thisPlayer.allowMovement) {
            if ((position.x.value == 8.5 && position.y.value == 65 && position.z.value == 8.5) || position.y.value < 1) {
                socket.thisPlayer.tick.teleportSelf = true
            
                var secondInvHasValidBlock = false
                if (socket.thisPlayer.joinCount % 2 == 0) {
                    socket.thisPlayer.inventory.held_item = "chest"
                    socket.thisPlayer.tick.heldItem = true
                    socket.thisPlayer.inventory.bucket_tracker = {empty: 0, water: 0, lava: 0}

                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("chest")) { packetWriter.Alpha.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "chest"), 64); secondInvHasValidBlock = true }
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("redstone_wire")) { packetWriter.Alpha.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "redstone"), 64); secondInvHasValidBlock = true }
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("diamond_ore")) { packetWriter.Alpha.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "diamond_ore"), 64); secondInvHasValidBlock = true }
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("diamond_block")) { packetWriter.Alpha.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "diamond_block"), 64); secondInvHasValidBlock = true }
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("crafting_table")) { packetWriter.Alpha.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "crafting_table"), 64); secondInvHasValidBlock = true }
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("wheat")) { packetWriter.Alpha.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "wheat_seeds"), 64); secondInvHasValidBlock = true }
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("farmland")) { packetWriter.Alpha.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "farmland"), 64); secondInvHasValidBlock = true }
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("furnace")) { packetWriter.Alpha.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "furnace"), 64); secondInvHasValidBlock = true }
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("oak_sign")) { packetWriter.Alpha.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "oak_sign"), 1); secondInvHasValidBlock = true }
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("oak_door")) { packetWriter.Alpha.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "oak_door"), 1); secondInvHasValidBlock = true }
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("ladder")) { packetWriter.Alpha.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "ladder"), 64); secondInvHasValidBlock = true }
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("rail")) { packetWriter.Alpha.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "rail"), 64); secondInvHasValidBlock = true }
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("cobblestone_stairs")) { packetWriter.Alpha.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "cobblestone_stairs"), 64); secondInvHasValidBlock = true }
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("lever")) { packetWriter.Alpha.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "lever"), 64); secondInvHasValidBlock = true }
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("stone_pressure_plate")) { packetWriter.Alpha.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "stone_pressure_plate"), 64); secondInvHasValidBlock = true }
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("iron_door")) { packetWriter.Alpha.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "iron_door"), 1); secondInvHasValidBlock = true }
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("oak_pressure_plate")) { packetWriter.Alpha.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "oak_pressure_plate"), 64); secondInvHasValidBlock = true }
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("redstone_ore")) { packetWriter.Alpha.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "redstone_ore"), 64); secondInvHasValidBlock = true }
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("redstone_torch")) { packetWriter.Alpha.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "redstone_torch"), 64); secondInvHasValidBlock = true }
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("stone_button")) { packetWriter.Alpha.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "stone_button"), 64); secondInvHasValidBlock = true }
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("snow")) { packetWriter.Alpha.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "snow"), 64); secondInvHasValidBlock = true }
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("ice")) { packetWriter.Alpha.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "ice"), 64); secondInvHasValidBlock = true }
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("snow_block")) { packetWriter.Alpha.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "snow_block"), 64); secondInvHasValidBlock = true }
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("cactus")) { packetWriter.Alpha.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "cactus"), 64); secondInvHasValidBlock = true }
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("clay")) { packetWriter.Alpha.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "clay"), 64); secondInvHasValidBlock = true }
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("sugar_cane")) { packetWriter.Alpha.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "sugar_cane"), 64); secondInvHasValidBlock = true }
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("jukebox")) { packetWriter.Alpha.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "jukebox"), 64); secondInvHasValidBlock = true }
                    //packetWriter.Alpha.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "painting"), 64)
                    //packetWriter.Alpha.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "minecart"), 1)
                    //packetWriter.Alpha.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "saddle"), 1)
                    //packetWriter.Alpha.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "chest_minecart"), 1)
                    //packetWriter.Alpha.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "furnace_minecart"), 1)
                }
                
                if (socket.thisPlayer.joinCount % 2 == 1 || !secondInvHasValidBlock) {
                    socket.thisPlayer.inventory.held_item = "stone"
                    socket.thisPlayer.tick.heldItem = true
                    socket.thisPlayer.inventory.bucket_tracker = {empty: 1, water: 1, lava: 1}

                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("stone")) packetWriter.Alpha.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "stone"), 64)
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("grass_block")) packetWriter.Alpha.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "grass_block"), 64)
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("dirt")) packetWriter.Alpha.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "dirt"), 64)
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("cobblestone")) packetWriter.Alpha.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "cobblestone"), 64)
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("oak_planks")) packetWriter.Alpha.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "oak_planks"), 64)
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("oak_sapling")) packetWriter.Alpha.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "oak_sapling"), 64)
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("bedrock")) packetWriter.Alpha.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "bedrock"), 64)
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("water")) packetWriter.Alpha.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "water_bucket"), 1)
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("lava")) packetWriter.Alpha.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "lava_bucket"), 1)
                    packetWriter.Alpha.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "bucket"), 1)
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("sand")) packetWriter.Alpha.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "sand"), 64)
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("gravel")) packetWriter.Alpha.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "gravel"), 64)
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("gold_ore")) packetWriter.Alpha.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "gold_ore"), 64)
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("iron_ore")) packetWriter.Alpha.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "iron_ore"), 64)
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("coal_ore")) packetWriter.Alpha.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "coal_ore"), 64)
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("oak_log")) packetWriter.Alpha.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "oak_log"), 64)
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("oak_leaves")) packetWriter.Alpha.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "oak_leaves"), 64)
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("sponge")) packetWriter.Alpha.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "sponge"), 64)
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("glass")) packetWriter.Alpha.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "glass"), 64)
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("white_wool")) packetWriter.Alpha.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "white_wool"), 64)
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("dandelion")) packetWriter.Alpha.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "dandelion"), 64)
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("poppy")) packetWriter.Alpha.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "poppy"), 64)
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("brown_mushroom")) packetWriter.Alpha.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "brown_mushroom"), 64)
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("red_mushroom")) packetWriter.Alpha.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "red_mushroom"), 64)
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("gold_block")) packetWriter.Alpha.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "gold_block"), 64)
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("iron_block")) packetWriter.Alpha.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "iron_block"), 64)
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("smooth_stone_slab")) packetWriter.Alpha.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "smooth_stone_slab"), 64)
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("bricks")) packetWriter.Alpha.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "bricks"), 64)
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("tnt")) packetWriter.Alpha.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "tnt"), 64)
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("bookshelf")) packetWriter.Alpha.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "bookshelf"), 64)
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("mossy_cobblestone")) packetWriter.Alpha.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "mossy_cobblestone"), 64)
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("obsidian")) packetWriter.Alpha.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "obsidian"), 64)
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("torch")) packetWriter.Alpha.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "torch"), 64)
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("fire")) packetWriter.Alpha.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "flint_and_steel"), 1)
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("spawner")) packetWriter.Alpha.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "spawner"), 64)
                    if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.block.includes("oak_stairs")) packetWriter.Alpha.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "oak_stairs"), 64)
                }
                return splitIndex
            }

            utils.player.set.PositionAndRotation(world, socket.thisPlayer, newPosition, newRotation)
        }
    }

    return splitIndex
}

module.exports = {ReadPacket}