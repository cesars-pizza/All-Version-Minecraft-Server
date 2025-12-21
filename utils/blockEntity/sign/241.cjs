const {Socket, Position} = require('../../../data_structures.cjs')
const dataReader = require('../../../data_handlers/data_reader.cjs')
const dataWriter = require('../../../data_handlers/data_writer.cjs')
const utils = require('../../utils.cjs')

/** 
 * @param {Socket} socket 
 * @param {string} id 
 * @param {Array} nbtData 
 */
function ConvertToUniversalData(world, socket, id, data) {    
    var positionX = dataReader.readInt(socket, data, 0)
    var positionY = dataReader.readShort(socket, data, positionX.nextPos)
    var positionZ = dataReader.readInt(socket, data, positionY.nextPos)
    var text1 = dataReader.readString(socket, data, positionZ.nextPos)
    var text2 = dataReader.readString(socket, data, text1.nextPos)
    var text3 = dataReader.readString(socket, data, text2.nextPos)
    var text4 = dataReader.readString(socket, data, text3.nextPos)
    if (isNaN(positionX.value) || isNaN(positionY.value) || isNaN(positionZ.value) || text1.value == undefined || text2.value == undefined || text3.value == undefined || text4.value == undefined) return {nextPos: -999}
    
    return {
        nextPos: text4.nextPos,
        data: {
            id: "oak_sign",
            position: {
                x: positionX.value,
                y: positionY.value,
                z: positionZ.value
            },
            isWaxed: false,
            frontText: {
                isGlowing: false,
                color: "black",
                messages: [
                    text1.value,
                    text2.value,
                    text3.value,
                    text4.value
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
}

/** 
 * @param {Socket} socket
 * @param {Array} data 
 */
function ConvertToVersionSpecificData(world, socket, data) {
    return [].concat(
        dataWriter.writeInt(socket, data.position.x),
        dataWriter.writeShort(socket, data.position.y),
        dataWriter.writeInt(socket, data.position.z),
        dataWriter.writeString(socket, data.frontText.messages[0]),
        dataWriter.writeString(socket, data.frontText.messages[1]),
        dataWriter.writeString(socket, data.frontText.messages[2]),
        dataWriter.writeString(socket, data.frontText.messages[3])
    )
}

module.exports = {ConvertToUniversalData, ConvertToVersionSpecificData}