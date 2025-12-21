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

        var sneaking = position.stance.value - position.y.value < 1.6        
        utils.player.set.Sneaking(world, socket.thisPlayer, sneaking)

        if (socket.disconnect == "" && !socket.thisPlayer.tick.teleportSelf && socket.thisPlayer.allowMovement) {
            if ((position.x.value == 8.5 && position.y.value == 65 && position.z.value == 8.5) || position.y.value < 1) {
                socket.thisPlayer.tick.teleportSelf = true

                var playerFullInventory = []
                if (socket.thisPlayer.joinCount % 2 == 0) {
                    var playerItems = [
                        "chest", "redstone", "diamond_ore", "diamond_block", "crafting_table", "wheat_seeds", "farmland", "furnace", "oak_sign",
                        "oak_door", "ladder", "rail", "cobblestone_stairs", "lever", "stone_pressure_plate", "iron_door", "oak_pressure_plate", "redstone_ore",
                        "redstone_torch", "stone_button", "snow", "ice", "snow_block", "cactus", "clay", "sugar_cane", "jukebox"
                    ]
                    var playerItemCounts = [
                        64, 64, 64, 64, 64, 64, 64, 64, 1,
                        1, 64, 64, 64, 64, 64, 1, 64, 64,
                        64, 64, 64, 64, 64, 64, 64, 64, 64
                    ]

                    for (var i = 0; i < playerItems.length; i++) {
                        if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.item.includes(playerItems[i])) {
                            playerFullInventory.push({
                                id: playerItems[i],
                                count: playerItemCounts[i],
                                added_components: [],
                                removed_components: []
                            })
                            var itemID = utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, playerItems[i])
                            if (typeof(itemID) == "number") packetWriter.Alpha.Add_To_Inventory(socket)(world, socket, itemID, playerItemCounts[i], 0)
                            else packetWriter.Alpha.Add_To_Inventory(socket)(world, socket, itemID.id, playerItemCounts[i], itemID.metadata)
                        }
                    }
                }
                
                if (socket.thisPlayer.joinCount % 2 == 1 || playerFullInventory.length == 0) {
                    var playerItems = [
                        "stone", "grass_block", "dirt", "cobblestone", "oak_planks", "oak_sapling", "bedrock", "water_bucket", "lava_bucket",
                        "bucket", "sand", "gravel", "gold_ore", "iron_ore", "coal_ore", "oak_log", "oak_leaves", "sponge",
                        "glass", "white_wool", "dandelion", "poppy", "brown_mushroom", "red_mushroom", "gold_block", "iron_block", "smooth_stone_slab",
                        "bricks", "tnt", "bookshelf", "mossy_cobblestone", "obsidian", "torch", "flint_and_steel", "spawner", "oak_stairs"
                    ]
                    var playerItemCounts = [
                        64, 64, 64, 64, 64, 64, 64, 1, 1,
                        1, 64, 64, 64, 64, 64, 64, 64, 64,
                        64, 64, 64, 64, 64, 64, 64, 64, 64,
                        64, 64, 64, 64, 64, 64, 1, 64, 64
                    ]

                    for (var i = 0; i < playerItems.length; i++) {
                        if (!world.config.suppressNonUniversalBlocks || world.universalRegistries.item.includes(playerItems[i])) {
                            playerFullInventory.push({
                                id: playerItems[i],
                                count: playerItemCounts[i],
                                added_components: [],
                                removed_components: []
                            })
                            var itemID = utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, playerItems[i])
                            if (typeof(itemID) == "number") packetWriter.Alpha.Add_To_Inventory(socket)(world, socket, itemID, playerItemCounts[i], 0)
                            else packetWriter.Alpha.Add_To_Inventory(socket)(world, socket, itemID.id, playerItemCounts[i], itemID.metadata)
                        }
                    }
                }

                while (playerFullInventory.length < 36) {
                    playerFullInventory.push({id: "air", count: 0, added_components: [], removed_components: []})
                }

                socket.thisPlayer.tick.heldItem = true
                socket.thisPlayer.inventory.slots.hotbar = playerFullInventory.slice(0, 9)
                socket.thisPlayer.inventory.slots.inventory = playerFullInventory.slice(9)
                socket.thisPlayer.inventory.bucket_tracker = {empty: 0, water: 0, lava: 0}
                socket.thisPlayer.inventory.held_item = socket.thisPlayer.inventory.slots.hotbar[0].id

                return splitIndex
            }

            utils.player.set.PositionAndRotation(world, socket.thisPlayer, newPosition, newRotation)
        }
    }

    return splitIndex
}

module.exports = {ReadPacket}