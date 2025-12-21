const {Socket, World} = require('../../../data_structures.cjs')
const dataReader = require('../../data_reader.cjs')
const packetWriter = require('../../clientbound_packets/packet_writer.cjs')
const utils = require('../../../utils/utils.cjs')
const { HexViewBytes } = require('../../../server.cjs')

var packetID = 102
var packetIdentifier = "Window Click"

/** 
 * @param {World} world 
 * @param {Socket} socket 
 * @param {Buffer} data 
 */
function ReadPacket(world, socket, data) {
    var splitIndex = data.length - 9

    socket.log(`SERVERBOUND --> ${packetID} "${packetIdentifier}" / ${data.length} bytes`)

    if (splitIndex >= 0) {
        var windowID = dataReader.readByte(socket, data, 1)
        var slot = dataReader.readShort(socket, data, windowID.nextPos)
        var rightClick = dataReader.readBool(socket, data, slot.nextPos)
        var actionNumber = dataReader.readShort(socket, data, rightClick.nextPos)
        var itemID = dataReader.readShort(socket, data, actionNumber.nextPos)

        if (itemID.value != -1) splitIndex -= 2

        if (splitIndex >= 0) {
            var itemCount = {value: 0}
            var itemMeta = {value: 0}
            if (itemID.value != -1) {
                itemCount = dataReader.readByte(socket, data, itemID.nextPos)
                itemMeta = dataReader.readByte(socket, data, itemCount.nextPos)
            }

            var itemName = utils.registry.item.GetItemName(world, socket.thisPlayer.selectedRegistries.item, `${itemID.value}:${itemMeta.value}`)

            var slotCategory = "unknown"
            var slotIndex = 0

            if (windowID.value == 0) {
                if (slot.value == 0) slotCategory = "player.craftingoutput"
                else if (slot.value >= 1 && slot.value <= 4) {
                    slotCategory = "player.crafting"
                    slotIndex = slot.value - 1
                } else if (slot.value >= 5 && slot.value <= 8) {
                    slotCategory = "armor"
                    slotIndex = slot.value - 5
                } else if (slot.value >= 9 && slot.value <= 35) {
                    slotCategory = "inventory"
                    slotIndex = slot.value - 9
                } else if (slot.value >= 36 && slot.value <= 44) {
                    slotCategory = "hotbar"
                    slotIndex = slot.value - 36
                } else if (slot.value == -999) slotCategory = "offscreen"
            } else if (windowID.value == 1) {
                if (slot.value == 0) slotCategory = "container.craftingoutput"
                else if (slot.value >= 1 && slot.value <= 9) {
                    slotCategory = "container"
                    slotIndex = slot.value - 1
                } else if (slot.value >= 10 && slot.value <= 36) {
                    slotCategory = "inventory"
                    slotIndex = slot.value - 10
                } else if (slot.value >= 37 && slot.value <= 45) {
                    slotCategory = "hotbar"
                    slotIndex = slot.value - 37
                } else if (slot.value == -999) slotCategory = "offscreen"
            } else if (windowID.value == 2) {
                if (slot.value >= 0 && slot.value <= 1) {
                    slotCategory = "container"
                    slotIndex = slot.value
                } 
                else if (slot.value == 2) slotCategory = "container.craftingoutput"
                else if (slot.value >= 3 && slot.value <= 29) {
                    slotCategory = "inventory"
                    slotIndex = slot.value - 3
                } else if (slot.value >= 30 && slot.value <= 38) {
                    slotCategory = "hotbar"
                    slotIndex = slot.value - 30
                } else if (slot.value == -999) slotCategory = "offscreen"
            } else if (windowID.value == 3) {
                if (slot.value >= 0 && slot.value <= 26) {
                    slotCategory = "container"
                    slotIndex = slot.value
                } 
                else if (slot.value >= 27 && slot.value <= 53) {
                    slotCategory = "inventory"
                    slotIndex = slot.value - 27
                } else if (slot.value >= 54 && slot.value <= 62) {
                    slotCategory = "hotbar"
                    slotIndex = slot.value - 54
                } else if (slot.value == -999) slotCategory = "offscreen"
            }

            console.log(`(${actionNumber.value}) ${rightClick.value ? "Right" : "Left"} Click in Window ${windowID.value}: ${slotCategory}.${slotIndex} = ${itemName} x${itemCount.value}`)

            if (itemName == "air") {
                if (socket.thisPlayer.inventory.slots.player.cursor.id == "air") console.log("Did nothing")
                else {
                    if (slotCategory == "player.craftingoutput" || slotCategory == "container.craftingOutput" || slotCategory == "armor") console.log("Did nothing")
                    else {
                        if (rightClick.value) {
                            console.log("Unknown Action")
                        } else {
                            console.log("Moved Items from Cursor into Slot")
                            if (slotCategory == "player.crafting") {
                                AddToInventory(world, socket, socket.thisPlayer.inventory.slots.player.crafting[slotIndex].id, socket.thisPlayer.inventory.slots.player.crafting[slotIndex].count)
                            }
                            else if (slotCategory == "inventory") socket.thisPlayer.inventory.slots.inventory[slotIndex] = socket.thisPlayer.inventory.slots.player.cursor
                            else if (slotCategory == "hotbar") socket.thisPlayer.inventory.slots.hotbar[slotIndex] = socket.thisPlayer.inventory.slots.player.cursor
                            socket.thisPlayer.inventory.slots.player.cursor = {id: "air", count: 0, added_components: [], removed_components: []}
                        }
                    }
                }
            } else {
                if (socket.thisPlayer.inventory.slots.player.cursor.id == "air") {
                    if (rightClick.value) {
                        console.log("Unknown Action")
                    } else {
                        console.log("Moved Items from Slot into Cursor")
                        if (slotCategory == "player.crafting") {
                            socket.thisPlayer.inventory.slots.player.cursor = socket.thisPlayer.inventory.slots.player.crafting[slotIndex]
                            socket.thisPlayer.inventory.slots.player.crafting[slotIndex] = {id: "air", count: 0, added_components: [], removed_components: []}
                        }
                        else if (slotCategory == "inventory") {
                            socket.thisPlayer.inventory.slots.player.cursor = socket.thisPlayer.inventory.slots.inventory[slotIndex]
                            socket.thisPlayer.inventory.slots.inventory[slotIndex] = {id: "air", count: 0, added_components: [], removed_components: []}
                        }
                        else if (slotCategory == "hotbar") {
                            socket.thisPlayer.inventory.slots.player.cursor = socket.thisPlayer.inventory.slots.hotbar[slotIndex]
                            socket.thisPlayer.inventory.slots.hotbar[slotIndex] = {id: "air", count: 0, added_components: [], removed_components: []}
                        }
                    }
                }
                else {
                    console.log("Unknown Action")
                }
            }
        }
    }
    
    return splitIndex
}

/** 
 * @param {Socket} socket 
 */
function AddToInventory(world, socket, item, count) {
    for (var i = 0; i < 9; i++) {
        if (socket.thisPlayer.inventory.slots.hotbar[i].id == item) {
            var amountAvailableToAdd = 64 - socket.thisPlayer.inventory.slots.hotbar[i].count
            if (amountAvailableToAdd >= count) {
                socket.thisPlayer.inventory.slots.hotbar[i].count += count
                count = 0
                break
            } else {
                socket.thisPlayer.inventory.slots.hotbar[i].count = 64
                count -= amountAvailableToAdd
            }
        }
    }

    if (count > 0) {
        for (var i = 0; i < 27; i++) {
            if (socket.thisPlayer.inventory.slots.inventory[i].id == item) {
                var amountAvailableToAdd = 64 - socket.thisPlayer.inventory.slots.inventory[i].count
                if (amountAvailableToAdd >= count) {
                    socket.thisPlayer.inventory.slots.inventory[i].count += count
                    count = 0
                    break
                } else {
                    socket.thisPlayer.inventory.slots.inventory[i].count = 64
                    count -= amountAvailableToAdd
                }
            }
        }
    }

    if (count > 0) {
        for (var i = 0; i < 9; i++) {
            if (socket.thisPlayer.inventory.slots.hotbar[i].id == "air") {
                socket.thisPlayer.inventory.slots.hotbar[i] = {
                    id: item,
                    count: count,
                    added_components: [],
                    removed_components: []
                }
                count = 0
                break
            }
        }
    }

    if (count > 0) {
        for (var i = 0; i < 27; i++) {
            if (socket.thisPlayer.inventory.slots.inventory[i].id == "air") {
                socket.thisPlayer.inventory.slots.inventory[i] = {
                    id: item,
                    count: count,
                    added_components: [],
                    removed_components: []
                }
                count = 0
                break
            }
        }
    }

    packetWriter.Beta.Window_Items(socket)(world, socket, 0, socket.thisPlayer.inventory.slots)
}

module.exports = {ReadPacket}