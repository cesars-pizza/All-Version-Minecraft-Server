const {Socket, Position, Inventory} = require('../../../../data_structures.cjs')
const dataWriter = require('../../../data_writer.cjs')
const utils = require('../../../../utils/utils.cjs')

var packetID = 104
var packetIdentifier = "Window Items"

/** 
 * @param {Socket} socket 
 * @param {number} inventoryType 
 * @param {Inventory} inventory 
 */
function WritePacket(world, socket, inventoryType, inventory) {
    if (inventoryType == 0) {
        var packetData = dataWriter.writeByte(socket, inventoryType).concat(
            dataWriter.writeShort(socket, 45)
        )

        for (var i = 0; i < 9; i++) {
            packetData = packetData.concat(dataWriter.writeShort(socket, -1))
        }

        for (var i = 0; i < 27; i++) {
            if (i >= inventory.inventory.length) {
                packetData = packetData.concat(dataWriter.writeShort(socket, -1))
            } else if (inventory.inventory[i].id == "air") {
                packetData = packetData.concat(dataWriter.writeShort(socket, -1))
            } else {
                var itemID = utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, inventory.inventory[i].id)
                if (itemID == 0) {
                    packetData = packetData.concat(dataWriter.writeShort(socket, -1))
                } else {
                    if (typeof(itemID) == "number") {
                    packetData = packetData.concat(
                        dataWriter.writeShort(socket, itemID),
                        dataWriter.writeByte(socket, inventory.inventory[i].count),
                        dataWriter.writeShort(socket, 0)
                    )
                    } else {
                        packetData = packetData.concat(
                            dataWriter.writeShort(socket, itemID.id),
                            dataWriter.writeByte(socket, inventory.inventory[i].count),
                            dataWriter.writeShort(socket, itemID.metadata)
                        )
                    }
                }
            }
        }

        for (var i = 0; i < 9; i++) {
            if (i >= inventory.hotbar.length) {
                packetData = packetData.concat(dataWriter.writeShort(socket, -1))
            } else if (inventory.hotbar[i].id == "air") {
                packetData = packetData.concat(dataWriter.writeShort(socket, -1))
            } else {
                var itemID = utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, inventory.hotbar[i].id)
                if (itemID == 0) {
                    packetData = packetData.concat(dataWriter.writeShort(socket, -1))
                } else {
                    if (typeof(itemID) == "number") {
                    packetData = packetData.concat(
                        dataWriter.writeShort(socket, itemID),
                        dataWriter.writeByte(socket, inventory.hotbar[i].count),
                        dataWriter.writeShort(socket, 0)
                    )
                    } else {
                        packetData = packetData.concat(
                            dataWriter.writeShort(socket, itemID.id),
                            dataWriter.writeByte(socket, inventory.hotbar[i].count),
                            dataWriter.writeShort(socket, itemID.metadata)
                        )
                    }
                }
            }
        }

        socket.writePacket(packetID, packetIdentifier, packetData)
    }
}

module.exports = {WritePacket}