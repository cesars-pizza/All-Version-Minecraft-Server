const {Socket} = require('../../data_structures.cjs')
const dataWriter = require('../../data_handlers/data_writer.cjs')
const packetWriter = require('../../data_handlers/clientbound_packets/packet_writer.cjs')

/** 
 * @param {Socket} socket 
 * @param {number[][][]} blocks 
 */
function GenerateBlocks(socket, blocks, notFirst) {
    var levelData = dataWriter.writeLevelData(socket, blocks)
    packetWriter.Classic.Level_Initilize(socket)(socket)
    packetWriter._alt.Classic.Level_Data_Chunk_alt0(socket)(socket, levelData)
    packetWriter.Classic.Level_Finalize(socket)(socket, 256, 64, 256)
}

module.exports = {GenerateBlocks}