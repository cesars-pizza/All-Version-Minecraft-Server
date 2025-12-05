const {Socket, World} = require('../../../data_structures.cjs')
const dataReader = require('../../data_reader.cjs')
const packetWriter = require('../../clientbound_packets/packet_writer.cjs')
const utils = require('../../../utils/utils.cjs')
const { HexViewBytes } = require('../../../server.cjs')

var packetID = 5
var packetIdentifier = "Player Inventory"

/** 
 * @param {World} world 
 * @param {Socket} socket 
 * @param {Buffer} data 
 */
function ReadPacket(world, socket, data) {
    socket.log(`SERVERBOUND --> ${packetID} "${packetIdentifier}" / ${data.length} bytes`, false)

    if (data.length < 6) return -999

    var inventoryType = dataReader.readInt(socket, data, 1)
    var inventoryLength = dataReader.readShort(socket, data, inventoryType.nextPos)

    var pointer = inventoryLength.nextPos

    var inventoryItems = []

    for (var i = 0; i < inventoryLength.value; i++) {
        var itemID = dataReader.readShort(socket, data, pointer)
        if (isNaN(itemID.value)) return -999
        
        if (itemID.value == -1) {
            pointer = itemID.nextPos
            inventoryItems.push({
                id: "air",
                count: 0,
                added_components: [],
                removed_components: []
            })
        } else {
            var itemCount = dataReader.readByte(socket, data, itemID.nextPos)
            if (itemCount.value == undefined) return -999
            var itemHealth = dataReader.readShort(socket, data, itemCount.nextPos)
            if (isNaN(itemHealth.value)) return -999
            pointer = itemHealth.nextPos

            inventoryItems.push({
                id: utils.registry.item.GetItemName(world, socket.thisPlayer.selectedRegistries.item, `${itemID.value}:${itemHealth.value}`),
                count: itemCount.value,
                added_components: [],
                removed_components: []
            })
        }
    }
    
    return data.length - pointer
}

module.exports = {ReadPacket}