const {Socket} = require('../../data_structures.cjs')
const { HexViewBytes } = require('../../server.cjs')
const dataWriter = require('../data_writer.cjs')
const fs = require('fs')

function Write(socket, blocks, blockMeta, blockLight, skyLight) {
    var dataStream = []
    for (var x = 0; x < blocks[0][0].length; x++) {
        for (var z = 0; z < blocks[0].length; z++) {
            for (var y = 0; y < blocks.length; y++) {
                dataStream.push(blocks[y][z][x])
            }
        }
    }

    for (var x = 0; x < blockMeta.length; x++) {
        for (var z = 0; z < blockMeta[0].length; z++) {
            for (var y = 0; y < blockMeta[0][0].length / 2; y++) {
                dataStream.push(blockMeta[y * 2][z][x] * 16 + blockMeta[y * 2 + 1][z][x])
            }
        }
    }

    for (var x = 0; x < blockLight.length; x++) {
        for (var z = 0; z < blockLight[0].length; z++) {
            for (var y = 0; y < blockLight[0][0].length / 2; y++) {
                dataStream.push(blockLight[y * 2][z][x] * 16 + blockLight[y * 2 + 1][z][x])
            }
        }
    }

    for (var x = 0; x < skyLight.length; x++) {
        for (var z = 0; z < skyLight[0].length; z++) {
            for (var y = 0; y < skyLight[0][0].length / 2; y++) {
                dataStream.push(skyLight[y * 2][z][x] * 16 + skyLight[y * 2 + 1][z][x])
            }
        }
    }
    
    HexViewBytes(Buffer.from(dataStream), 'chunkData')

    dataStream = dataWriter.writeZlib(socket, dataStream)

    return dataStream
}

module.exports = {Write}