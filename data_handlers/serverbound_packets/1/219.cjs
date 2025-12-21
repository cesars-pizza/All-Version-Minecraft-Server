const {Socket, World} = require('../../../data_structures.cjs')
const dataReader = require('../../data_reader.cjs')
const packetWriter = require('../../clientbound_packets/packet_writer.cjs')
const utils = require('../../../utils/utils.cjs')
const {HexViewBytes} = require('../../../server.cjs')

var packetID = 1
var packetIdentifier = "Login Request"

/** 
 * @param {World} world 
 * @param {Socket} socket 
 * @param {Buffer} data 
 */
function ReadPacket(world, socket, data) {
    var packet = dataReader.readUByte(socket, data, 0)
    var protocolVersion = dataReader.readInt(socket, data, packet.nextPos)
    var username = dataReader.readString(socket, data, protocolVersion.nextPos)
    var password = dataReader.readString(socket, data, username.nextPos)
    
    if (socket.thisPlayer.inWorld) return 0
    
    socket.log(`SERVERBOUND --> ${packetID} "${packetIdentifier}" / ${data.length} bytes`)
    
    if (isNaN(protocolVersion.value) || username.value == undefined || password.value == undefined) return -999
    else {
        if (socket.disconnect == "") {
            var hasOpenInstance = utils.player.HasOpenInstance(world, username.value)
            if (!hasOpenInstance) {
                socket.thisPlayer = utils.player.InitializePlayer(world, socket.thisPlayer, socket, username.value)

                if (!socket.thisPlayer.verified) {
                    world.loadingPlayerNames[world.loadingPlayerNames.indexOf("")] = socket.thisPlayer.username
                    
                    packetWriter.Alpha.Login_Response(socket)(world, socket, socket.thisPlayer.alphaID, world.config.serverName, world.config.serverStatus, 0, 0)
                    utils.world_packets.GenerateRenderDistance(socket)(world, socket, world.config.renderDistance.default, Math.floor(socket.thisPlayer.position.x / 16), Math.floor(socket.thisPlayer.position.z / 16), undefined, undefined)
                    
                    for (var i = 0; i < world.loadedPlayers.length; i++) {
                        socket.thisPlayer.otherPlayers[world.loadedPlayers[i].alphaID] = {
                            rendered: true,
                            estimatedPosition: {
                                x: Math.floor(world.loadedPlayers[i].position.x * 32) / 32,
                                y: Math.floor(world.loadedPlayers[i].position.x * 32) / 32,
                                z: Math.floor(world.loadedPlayers[i].position.x * 32) / 32
                            }
                        }
                        packetWriter.Alpha.Named_Entity_Spawn(socket)(socket, world.loadedPlayers[i].alphaID, world.loadedPlayers[i].username, world.loadedPlayers[i].position, world.loadedPlayers[i].rotation, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, world.loadedPlayers[i].inventory.held_item))
                    }

                    var playerFullInventory = []
                    if (socket.thisPlayer.joinCount % 2 == 0) {
                        var playerItems = [
                            "chest", "redstone", "diamond_ore", "diamond_block", "crafting_table", "wheat_seeds", "farmland", "furnace", "oak_sign",
                            "oak_door", "ladder", "rail", "cobblestone_stairs", "lever", "stone_pressure_plate", "iron_door", "oak_pressure_plate", "redstone_ore",
                            "redstone_torch", "stone_button", "snow", "ice", "snow_block", "cactus", "clay", "sugar_cane", "jukebox",
                            "oak_fence"
                        ]
                        var playerItemCounts = [
                            64, 64, 64, 64, 64, 64, 64, 64, 1,
                            1, 64, 64, 64, 64, 64, 1, 64, 64,
                            64, 64, 64, 64, 64, 64, 64, 64, 64,
                            64
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

                    world.loadingPlayerNames.splice(world.loadingPlayerNames.indexOf(socket.thisPlayer.username))
                    world.loadedPlayers.push(socket.thisPlayer)

                    socket.thisPlayer.inWorld = true
                } else {
                    socket.setDisconnect("unverified")
                    utils.disconnect(socket)(world, socket)
                }
            } else {
                socket.setDisconnect("multipleInstances")
                socket.thisPlayer.username = username.value
                utils.disconnect(socket)(world, socket)
            }
        } else utils.disconnect(socket)(world, socket)

        return data.length - (packet.length + protocolVersion.length + username.length + password.length)
    }
}

module.exports = {ReadPacket}