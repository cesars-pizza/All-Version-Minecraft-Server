const {Socket} = require('../../data_structures')
const dataWriter = require('../../data_handlers/data_writer')
const packetWriter = require('../../data_handlers/clientbound_packets/packet_writer')

/** 
 * @param {Socket} socket 
 * @param {number[][][]} blocks 
 */
function GenerateBlocks(socket, blocks) {
    var levelData = dataWriter.writeLevelData(socket, blocks)
    packetWriter.Level_Initilize(socket)(socket)
    packetWriter._alt.Level_Data_Chunk_alt0(socket)(socket, levelData)
    packetWriter.Level_Finalize(socket)(socket, 256, 64, 256)
}

module.exports = {GenerateBlocks}