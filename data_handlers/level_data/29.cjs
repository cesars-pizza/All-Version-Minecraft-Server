const {Socket} = require('../../data_structures.cjs')
const dataWriter = require('../data_writer.cjs')
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
    dataStream = dataWriter.writeGZip(socket, dataStream)

    var dataChunks = []
    for (var i = 0; i < dataStream.length / 1024; i++) {
        dataChunks[i] = dataStream.slice(i * 1024, (i + 1) * 1024)
    }
    
    return dataChunks
}

module.exports = {Write}