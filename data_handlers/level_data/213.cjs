const {Socket} = require('../../data_structures.cjs')
const { HexViewBytes } = require('../../server.cjs')
const dataWriter = require('../data_writer.cjs')
const fs = require('fs')

function Write(socket, data) {
    var dataStream = []

    for (var x = 0; x < data.length; x++) {
        for (var z = 0; z < data[0].length; z++) {
            for (var innerX = 0; innerX < 16; innerX++) {
                for (var innerZ = 0; innerZ < 16; innerZ++) {
                    for (var y = 0; y < 128; y++) {
                        dataStream.push(data[x][z].blocks[y][innerZ][innerX])
                    }
                }
            }

            for (var innerX = 0; innerX < 16; innerX++) {
                for (var innerZ = 0; innerZ < 16; innerZ++) {
                    for (var y = 0; y < 128; y+=2) {
                        dataStream.push(data[x][z].blockMeta[y][innerZ][innerX] + data[x][z].blockMeta[y + 1][innerZ][innerX] * 16)
                    }
                }
            }

            for (var innerX = 0; innerX < 16; innerX++) {
                for (var innerZ = 0; innerZ < 16; innerZ++) {
                    for (var y = 0; y < 128; y+=2) {
                        dataStream.push(data[x][z].blockLight[y][innerZ][innerX] * 16 + data[x][z].blockLight[y + 1][innerZ][innerX])
                    }
                }
            }

            for (var innerX = 0; innerX < 16; innerX++) {
                for (var innerZ = 0; innerZ < 16; innerZ++) {
                    for (var y = 0; y < 128; y+=2) {
                        dataStream.push(data[x][z].skyLight[y][innerZ][innerX] * 16 + data[x][z].skyLight[y + 1][innerZ][innerX])
                    }
                }
            }
        }
    }

    //for (var x = 0; x < data.length; x++) {
    //    for (var innerX = 0; innerX < 16; innerX++) {
    //        for (var z = 0; z < data[0].length; z++) {
    //            for (var innerZ = 0; innerZ < 16; innerZ++) {
    //                for (var y = 0; y < 128; y++) {
    //                    dataStream.push(data[x][z].blocks[y][innerZ][innerX])
    //                }
    //            }
    //        }
    //    }
    //}
//
    //for (var x = 0; x < data.length; x++) {
    //    for (var innerX = 0; innerX < 16; innerX++) {
    //        for (var z = 0; z < data[0].length; z++) {
    //            for (var innerZ = 0; innerZ < 16; innerZ++) {
    //                for (var y = 0; y < 128; y += 2) {
    //                    dataStream.push(data[x][z].blockMeta[y][innerZ][innerX] * 16 + data[x][z].blockMeta[y + 1][innerZ][innerX])
    //                }
    //            }
    //        }
    //    }
    //}
//
    //for (var x = 0; x < data.length; x++) {
    //    for (var innerX = 0; innerX < 16; innerX++) {
    //        for (var z = 0; z < data[0].length; z++) {
    //            for (var innerZ = 0; innerZ < 16; innerZ++) {
    //                for (var y = 0; y < 128; y += 2) {
    //                    dataStream.push(data[x][z].blockLight[y][innerZ][innerX] * 16 + data[x][z].blockLight[y + 1][innerZ][innerX])
    //                }
    //            }
    //        }
    //    }
    //}
//
    //for (var x = 0; x < data.length; x++) {
    //    for (var innerX = 0; innerX < 16; innerX++) {
    //        for (var z = 0; z < data[0].length; z++) {
    //            for (var innerZ = 0; innerZ < 16; innerZ++) {
    //                for (var y = 0; y < 128; y += 2) {
    //                    dataStream.push(data[x][z].skyLight[y][innerZ][innerX] * 16 + data[x][z].skyLight[y + 1][innerZ][innerX])
    //                }
    //            }
    //        }
    //    }
    //}
    
    dataStream = dataWriter.writeZlib(socket, dataStream)

    return dataStream
}

module.exports = {Write}