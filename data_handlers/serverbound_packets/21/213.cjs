const {Socket, World} = require('../../../data_structures.cjs')
const dataReader = require('../../data_reader.cjs')
const packetWriter = require('../../clientbound_packets/packet_writer.cjs')
const utils = require('../../../utils/utils.cjs')
const { HexViewBytes } = require('../../../server.cjs')

var packetID = 21
var packetIdentifier = "Pickup Spawn"

/** 
 * @param {World} world 
 * @param {Socket} socket 
 * @param {Buffer} data 
 */
function ReadPacket(world, socket, data) {
    var splitIndex = data.length - 23
    
    socket.log(`SERVERBOUND --> ${packetID} "${packetIdentifier}" / ${data.length} bytes`)

    if (splitIndex >= 0) {

        var itemID = dataReader.readShort(socket, data, 5)
        var itemCount = dataReader.readByte(socket, data, itemID.nextPos)

        var itemName = utils.registry.item.GetItemName(world, socket.thisPlayer.selectedRegistries.item, itemID.value)

        if (socket.disconnect == "") {
            if (itemName.endsWith('bucket')) {
                console.log(socket.thisPlayer.inventory.bucket_tracker)

                if (itemName == "bucket") socket.thisPlayer.inventory.bucket_tracker.empty--
                else if (itemName == "water_bucket") socket.thisPlayer.inventory.bucket_tracker.water--
                else if (itemName == "lava_bucket") socket.thisPlayer.inventory.bucket_tracker.lava--

                if (socket.thisPlayer.inventory.bucket_tracker.empty == 0) {
                    socket.thisPlayer.inventory.bucket_tracker.empty++
                    packetWriter.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "bucket"), itemCount.value, 0)
                } else if (socket.thisPlayer.inventory.bucket_tracker.water == 0) {
                    socket.thisPlayer.inventory.bucket_tracker.water++
                    packetWriter.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "water_bucket"), itemCount.value, 0)
                } else if (socket.thisPlayer.inventory.bucket_tracker.lava == 0) {
                    socket.thisPlayer.inventory.bucket_tracker.lava++
                    packetWriter.Add_To_Inventory(socket)(world, socket, utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, "lava_bucket"), itemCount.value, 0)
                }
            }
            else packetWriter.Add_To_Inventory(socket)(world, socket, itemID.value, itemCount.value, 0)
        }

    }
    
    return splitIndex
}

module.exports = {ReadPacket}