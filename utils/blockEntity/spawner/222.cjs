const {Socket, Position} = require('../../../data_structures.cjs')
const dataReader = require('../../../data_handlers/data_reader.cjs')
const dataWriter = require('../../../data_handlers/data_writer.cjs')
const utils = require('../../utils.cjs')

/** 
 * @param {Socket} socket 
 * @param {string} id 
 * @param {Position} position 
 * @param {Array} data 
 */
function ConvertToUniversalData(world, socket, id, position, data) {
    var nbtData = dataReader.readNBT(socket, dataReader.readGZip(socket, data, 0), 0).value
    
    return {
        id: "spawner",
        position: position,
        spawnDelay: {
            min: 200,
            max: 600,
            current: nbtData.Delay.value
        },
        spawnCount: 1,
        entity: utils.registry.entity.GetEntityName(world, socket.thisPlayer.selectedRegistries.entity, nbtData.EntityId.value)
    }
}

/** 
 * @param {Socket} socket
 * @param {Array} data 
 */
function ConvertToVersionSpecificData(world, socket, data) {
    return dataWriter.writeNBT.WriteNBT(socket, "", {
        id: dataWriter.writeNBT.WriteTag_String(socket, "Sign"),
        x: dataWriter.writeNBT.WriteTag_Int(socket, data.position.x),
        y: dataWriter.writeNBT.WriteTag_Int(socket, data.position.y),
        z: dataWriter.writeNBT.WriteTag_Int(socket, data.position.z),
        Text1: dataWriter.writeNBT.WriteTag_String(socket, data.frontText.messages[0]),
        Text2: dataWriter.writeNBT.WriteTag_String(socket, data.frontText.messages[1]),
        Text3: dataWriter.writeNBT.WriteTag_String(socket, data.frontText.messages[2]),
        Text4: dataWriter.writeNBT.WriteTag_String(socket, data.frontText.messages[3])
    })
}

module.exports = {ConvertToUniversalData, ConvertToVersionSpecificData}