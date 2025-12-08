const {Socket, Position} = require('../../../data_structures.cjs')
const dataReader = require('../../../data_handlers/data_reader.cjs')
const dataWriter = require('../../../data_handlers/data_writer.cjs')
const utils = require('../../utils.cjs')

/** 
 * @param {Socket} socket 
 * @param {string} id 
 * @param {Array} nbtData 
 */
function ConvertToUniversalData(world, socket, id, nbtData) {    
    var items = []
    for (var i = 0; i < nbtData.Items.value.length; i++) {
        items.push({
            id: utils.registry.item.GetItemName(world, socket.thisPlayer.selectedRegistries.item, `${nbtData.Items.value[i].id.value}:${nbtData.Items.value[i].Damage.value}`),
            slot: nbtData.Items.value[i].Slot.value,
            count: nbtData.Items.value[i].Count.value,
            added_components: [],
            removed_components: []
        })
    }

    return {
        id: "chest",
        position: {
            x: nbtData.x.value,
            y: nbtData.y.value,
            z: nbtData.z.value
        },
        customName: undefined,
        items: items,
        lock: undefined,
        gold: false
    }
}

/** 
 * @param {Socket} socket
 * @param {Array} data 
 */
function ConvertToVersionSpecificData(world, socket, data) {
    return {
        id: dataWriter.writeNBT.WriteTag_String(socket, "Chest"),
        x: dataWriter.writeNBT.WriteTag_Int(socket, data.position.x),
        y: dataWriter.writeNBT.WriteTag_Int(socket, data.position.y),
        z: dataWriter.writeNBT.WriteTag_Int(socket, data.position.z),
        Items: dataWriter.writeNBT.WriteTag_List(socket, data.items.map(item => {
            var itemID = utils.registry.item.GetItemID(world, socket.thisPlayer.selectedRegistries.item, item.id)

            if (typeof(itemID) == "number") {
                return dataWriter.writeNBT.WriteTag_Compound(socket, {
                    id: dataWriter.writeNBT.WriteTag_Short(socket, itemID),
                    Damage: dataWriter.writeNBT.WriteTag_Short(socket, 0),
                    Count: dataWriter.writeNBT.WriteTag_Byte(socket, item.count),
                    Slot: dataWriter.writeNBT.WriteTag_Byte(socket, item.slot),
                })
            } else {
                return dataWriter.writeNBT.WriteTag_Compound(socket, {
                    id: dataWriter.writeNBT.WriteTag_Short(socket, itemID.id),
                    Damage: dataWriter.writeNBT.WriteTag_Short(socket, itemID.metadata),
                    Count: dataWriter.writeNBT.WriteTag_Byte(socket, item.count),
                    Slot: dataWriter.writeNBT.WriteTag_Byte(socket, item.slot),
                })
            }
        }))
    }
}

module.exports = {ConvertToUniversalData, ConvertToVersionSpecificData}