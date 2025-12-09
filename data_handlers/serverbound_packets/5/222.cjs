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
    socket.log(`SERVERBOUND --> ${packetID} "${packetIdentifier}" / ${data.length} bytes`)

    if (data.length < 7) return -999

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

    if (inventoryType.value == -1) {
        var currentItemCounts = {}
        var newItemCounts = {}

        for (var i = 0; i < socket.thisPlayer.inventory.slots.hotbar.length; i++) {
            if (socket.thisPlayer.inventory.slots.hotbar[i].id == "air") continue

            if (currentItemCounts[socket.thisPlayer.inventory.slots.hotbar[i].id] == undefined) currentItemCounts[socket.thisPlayer.inventory.slots.hotbar[i].id] = 0
            currentItemCounts[socket.thisPlayer.inventory.slots.hotbar[i].id] += socket.thisPlayer.inventory.slots.hotbar[i].count
        }
        for (var i = 0; i < socket.thisPlayer.inventory.slots.inventory.length; i++) {
            if (socket.thisPlayer.inventory.slots.inventory[i].id == "air") continue

            if (currentItemCounts[socket.thisPlayer.inventory.slots.inventory[i].id] == undefined) currentItemCounts[socket.thisPlayer.inventory.slots.inventory[i].id] = 0
            currentItemCounts[socket.thisPlayer.inventory.slots.inventory[i].id] += socket.thisPlayer.inventory.slots.inventory[i].count
        }
        for (var i = 0; i < inventoryItems.length; i++) {
            if (inventoryItems[i].id == "air") continue
            
            if (newItemCounts[inventoryItems[i].id] == undefined) newItemCounts[inventoryItems[i].id] = 0
            newItemCounts[inventoryItems[i].id] += inventoryItems[i].count
        }

        var itemsInInventory = Object.keys(currentItemCounts)
        var itemsInNewInventory = Object.keys(newItemCounts)
        for (var i = 0; i < itemsInNewInventory.length; i++) {
            if (!itemsInInventory.includes(itemsInNewInventory[i])) {
                for (var j = 0; j < inventoryItems.length; j++) {
                    if (inventoryItems[j].id == itemsInNewInventory[i]) {
                        inventoryItems[j] = {
                            id: "air",
                            count: 0,
                            added_components: [],
                            removed_components: []
                        }
                    }
                }
            }
        }
        for (var i = 0; i < itemsInInventory.length; i++) {
            var itemDif = currentItemCounts[itemsInInventory[i]] - newItemCounts[itemsInInventory[i]]

            if (itemDif < 0) {
                for (var j = 0; j < inventoryItems.length; j++) {
                    if (inventoryItems[j].id == itemsInInventory[i]) {
                        if (inventoryItems[j].count == -itemDif) {
                            inventoryItems[j].id = "air"
                            inventoryItems[j].count = 0
                            break
                        } else if (inventoryItems[j].count < -itemDif) {
                            inventoryItems[j].id = "air"
                            inventoryItems[j].count = 0
                            itemDif += inventoryItems[j].count
                        } else {
                            inventoryItems[j].count += itemDif
                            break
                        }
                    }
                }
            } 
        }

        for (var i = 0; i < itemsInInventory.length; i++) {
            var itemDif = currentItemCounts[itemsInInventory[i]] - newItemCounts[itemsInInventory[i]]

            if (isNaN(itemDif)) {
                for (var j = 0; j < inventoryItems.length; j++) {
                    if (inventoryItems[j].id == "air") {
                        inventoryItems[j].id = itemsInInventory[i]
                        inventoryItems[j].count = currentItemCounts[itemsInInventory[i]]
                        break
                    }
                }
            } else if (itemDif > 0) {
                for (var j = 0; j < inventoryItems.length; j++) {
                    if (inventoryItems[j].id == itemsInInventory[i]) {
                        inventoryItems[j].count += itemDif
                        break
                    }
                }
            }
        }

        socket.thisPlayer.inventory.slots.hotbar = inventoryItems.slice(0, 9)
        socket.thisPlayer.inventory.slots.inventory = inventoryItems.slice(9)

        packetWriter.Alpha.Player_Inventory(socket)(world, socket, -1, socket.thisPlayer.inventory.slots)
    }
    
    return data.length - pointer
}

module.exports = {ReadPacket}