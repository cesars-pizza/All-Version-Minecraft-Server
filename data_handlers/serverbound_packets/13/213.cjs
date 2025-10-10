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
                packetWriter.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "stone"), 64)
                packetWriter.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "grass_block"), 64)
                packetWriter.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "dirt"), 64)
                packetWriter.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "cobblestone"), 64)
                packetWriter.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "oak_planks"), 64)
                packetWriter.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "oak_sapling"), 64)
                packetWriter.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "bedrock"), 64)
                packetWriter.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "water_bucket"), 1)
                packetWriter.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "lava_bucket"), 1)
                packetWriter.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "bucket"), 1)
                packetWriter.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "sand"), 64)
                packetWriter.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "gravel"), 64)
                packetWriter.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "gold_ore"), 64)
                packetWriter.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "iron_ore"), 64)
                packetWriter.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "coal_ore"), 64)
                packetWriter.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "oak_log"), 64)
                packetWriter.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "oak_leaves"), 64)
                packetWriter.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "sponge"), 64)
                packetWriter.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "glass"), 64)
                packetWriter.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "white_wool"), 64)
                packetWriter.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "dandelion"), 64)
                packetWriter.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "poppy"), 64)
                packetWriter.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "brown_mushroom"), 64)
                packetWriter.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "red_mushroom"), 64)
                packetWriter.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "gold_block"), 64)
                packetWriter.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "iron_block"), 64)
                packetWriter.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "smooth_stone_slab"), 64)
                packetWriter.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "bricks"), 64)
                packetWriter.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "tnt"), 64)
                packetWriter.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "bookshelf"), 64)
                packetWriter.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "mossy_cobblestone"), 64)
                packetWriter.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "obsidian"), 64)
                packetWriter.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "torch"), 64)
                packetWriter.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "flint_and_steel"), 1)
                packetWriter.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "spawner"), 64)
                packetWriter.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "oak_stairs"), 64)
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