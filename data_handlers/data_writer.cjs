module.exports = {
    writeByte: require('./byte/byte.cjs').Write,
    writeUByte: require('./ubyte/ubyte.cjs').Write,
    writeShort: require('./short/short.cjs').Write,
    writeFixed5Short: require('./fixed5short/fixed5short.cjs').Write,
    writeUInt: require('./uint/uint.cjs').Write,
    writeString: require('./string/string.cjs').Write,
    writeLevelData: require('./level_data/level_data.cjs').Write,
    writeGZip: require('./gzip/gzip.cjs').Write,
    writePacket: require('./packet/packet.cjs').Write
}