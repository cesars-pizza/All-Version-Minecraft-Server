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
            if (utils.math.NegMod(posX.value, 32) >= 16 && utils.math.NegMod(posZ.value, 32) >= 16) {
                var hitBuildIndex = utils.builds.GetBuild(world, Math.floor(posX.value / 32), Math.floor(posZ.value / 32))
                if (hitBuildIndex == undefined || world.builds[hitBuildIndex].creator == socket.thisPlayer.username) {
                    if (hitBuildIndex == undefined) {
                        hitBuildIndex = world.builds.length
                        world.builds.push(utils.builds.GenerateBuild(Math.floor(posX.value / 32), Math.floor(posZ.value / 32), socket.thisPlayer.username, socket.thisPlayer.uvni))
                    }

                    if (posY.value <= 1) {
                        if (mode.value == 0) {
                            var floorID = utils.registry.block.GetBlockID(world, socket.thisPlayer.selectedRegistries.block, world.builds[hitBuildIndex].floor)
                            floorID++
                            if (floorID >= Object.keys(world.registries.block[socket.thisPlayer.selectedRegistries.block].entries).length) floorID = 1
                            world.builds[hitBuildIndex].floor = utils.registry.block.GetBlockName(world, socket.thisPlayer.selectedRegistries.block, floorID)
                            world.builds[hitBuildIndex].lastModified = new Date().getTime()
                            world.builds[hitBuildIndex].save = true
                            for (var x = 0; x < 16; x++) {
                                for (var z = 0; z < 16; z++) {
                                    var setX = Math.floor(posX.value / 16) * 16 + x
                                    var setZ = Math.floor(posZ.value / 16) * 16 + z
                                    packetWriter.Set_Block(socket)(socket, {x: setX, y: 1, z: setZ}, floorID)
                                }
                            }
                        } else {
                            world.builds[hitBuildIndex].floor = utils.registry.block.GetBlockName(world, socket.thisPlayer.selectedRegistries.block, blockID.value)
                            world.builds[hitBuildIndex].lastModified = new Date().getTime()
                            world.builds[hitBuildIndex].save = true
                            for (var x = 0; x < 16; x++) {
                                for (var z = 0; z < 16; z++) {
                                    var setX = Math.floor(posX.value / 16) * 16 + x
                                    var setZ = Math.floor(posZ.value / 16) * 16 + z
                                    packetWriter.Set_Block(socket)(socket, {x: setX, y: 1, z: setZ}, blockID.value)
                                }
                            }
                        }
                    } else if (posY.value < 64) {
                        if (mode.value == 1) {
                            world.builds[hitBuildIndex].blocks[posY.value - 2][posZ.value % 16][posX.value % 16] = utils.registry.block.GetBlockName(world, socket.thisPlayer.selectedRegistries.block, blockID.value)
                            packetWriter.Set_Block(socket)(socket, {x: posX.value, y: posY.value, z: posZ.value}, blockID.value)
                        } else {
                            world.builds[hitBuildIndex].blocks[posY.value - 2][posZ.value % 16][posX.value % 16] = "air"
                            packetWriter.Set_Block(socket)(socket, {x: posX.value, y: posY.value, z: posZ.value}, 0)
                        }
                    }
                }
            }
        }

    }
    
    return splitIndex
}

module.exports = {ReadPacket}