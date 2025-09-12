const {Socket} = require('../../data_structures')
const dataWriter = require('../data_writer')
const fs = require('fs')

function Write(socket, blocks) {
    var dataStream = []
    for (var y = 0; y < blocks.length; y++) {
        for (var z = 0; z < blocks[0].length; z++) {
            for (var x = 0; x < blocks[0][0].length; x++) {
                dataStream.push(blocks[y][z][x])
            }
        }
    }
    
    dataStream = dataWriter.writeUInt(socket, dataStream.length).concat(dataStream)
    //dataStream = [0xec, 0x9d, 0x59, 0xb2].concat(dataStream)
    
    fs.writeFileSync('./debug/levelDataRaw.bin', Buffer.from(dataStream))
    
    dataStream = dataWriter.writeGZip(socket, dataStream)

    fs.writeFileSync('./debug/levelDataCompressed.gz', Buffer.from(dataStream))

    var dataChunks = []
    for (var i = 0; i < dataStream.length / 1024; i++) {
        dataChunks[i] = dataStream.slice(i * 1024, (i + 1) * 1024)
    }
    
    return dataChunks
}

module.exports = {Write}