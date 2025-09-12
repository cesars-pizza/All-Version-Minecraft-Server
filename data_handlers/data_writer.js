module.exports = {
    writeByte: require('./byte/byte').Write,
    writeUByte: require('./ubyte/ubyte').Write,
    writeShort: require('./short/short').Write,
    writeFixed5Short: require('./fixed5short/fixed5short').Write,
    writeUInt: require('./uint/uint').Write,
    writeString: require('./string/string').Write,
    writeLevelData: require('./level_data/level_data').Write,
    writeGZip: require('./gzip/gzip').Write,
    writePacket: require('./packet/packet').Write
}