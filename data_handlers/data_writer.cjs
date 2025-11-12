module.exports = {
    writeBool: require('./bool/bool.cjs').Write,
    writeByte: require('./number/byte/byte.cjs').Write,
    writeUByte: require('./number/ubyte/ubyte.cjs').Write,
    writeShort: require('./number/short/short.cjs').Write,
    writeFixed5Short: require('./number/fixed5short/fixed5short.cjs').Write,
    writeInt: require('./number/int/int.cjs').Write,
    writeUInt: require('./number/uint/uint.cjs').Write,
    writeLong: require('./number/long/long.cjs').Write,
    writeFloat: require('./number/float/float.cjs').Write,
    writeDouble: require('./number/double/double.cjs').Write,
    writeString: require('./string/string.cjs').Write,
    writeLevelData: require('./level_data/level_data.cjs').Write,
    writeGZip: require('./gzip/gzip.cjs').Write,
    writeZlib: require('./zlib/zlib.cjs').Write,
    writePacket: require('./packet/packet.cjs').Write
}