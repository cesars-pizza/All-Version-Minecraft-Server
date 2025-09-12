const {Socket} = require('../../../data_structures')
const dataWriter = require('../../data_writer')

var packetID = 3
var packetIdentifier = "Level Data Chunk"

/** 
 * @param {Socket} socket 
 * @param {number[][][]} blocks
 */
function WritePacket(socket, blocks) {
    var levelDataChunks = dataWriter.writeLevelData(socket, blocks)

    for (var i = 0; i < levelDataChunks.length; i++) {
        var thisLevelDataChunk = levelDataChunks[i]
        var thisLength = thisLevelDataChunk.length
        while (thisLevelDataChunk.length < 1024) thisLevelDataChunk.push(0)

        socket.writePacket(packetID, packetIdentifier,
            dataWriter.writeShort(socket, thisLength).concat(
                thisLevelDataChunk,
                dataWriter.writeUByte(socket, Math.round((i / (levelDataChunks.length - 1)) * 100))
            )
        )
    }
}

/** 
 * @param {Socket} socket 
 * @param {number[][]} levelData
 */
function WritePacket_Alt0(socket, levelData) {
    for (var i = 0; i < levelData.length; i++) {
        var thisLevelDataChunk = levelData[i]
        var thisLength = thisLevelDataChunk.length
        while (thisLevelDataChunk.length < 1024) thisLevelDataChunk.push(0)

        socket.writePacket(packetID, packetIdentifier,
            dataWriter.writeShort(socket, thisLength).concat(
                thisLevelDataChunk,
                dataWriter.writeUByte(socket, Math.round((i / (levelData.length - 1)) * 100))
            )
        )
    }
}

module.exports = {WritePacket, WritePacket_Alt0}