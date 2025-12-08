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
    return {
        id: "oak_sign",
        position: {
            x: nbtData.x.value,
            y: nbtData.y.value,
            z: nbtData.z.value
        },
        isWaxed: false,
        frontText: {
            isGlowing: false,
            color: "black",
            messages: [
                nbtData.Text1.value,
                nbtData.Text2.value,
                nbtData.Text3.value,
                nbtData.Text4.value
            ]
        },
        backText: {
            isGlowing: false,
            color: "black",
            messages: [
                "",
                "",
                "",
                ""
            ]
        }
    }
}

/** 
 * @param {Socket} socket
 * @param {Array} data 
 */
function ConvertToVersionSpecificData(world, socket, data) {
    return {
        id: dataWriter.writeNBT.WriteTag_String(socket, "Sign"),
        x: dataWriter.writeNBT.WriteTag_Int(socket, data.position.x),
        y: dataWriter.writeNBT.WriteTag_Int(socket, data.position.y),
        z: dataWriter.writeNBT.WriteTag_Int(socket, data.position.z),
        Text1: dataWriter.writeNBT.WriteTag_String(socket, data.frontText.messages[0]),
        Text2: dataWriter.writeNBT.WriteTag_String(socket, data.frontText.messages[1]),
        Text3: dataWriter.writeNBT.WriteTag_String(socket, data.frontText.messages[2]),
        Text4: dataWriter.writeNBT.WriteTag_String(socket, data.frontText.messages[3])
    }
}

module.exports = {ConvertToUniversalData, ConvertToVersionSpecificData}