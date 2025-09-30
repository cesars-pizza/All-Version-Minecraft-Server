module.exports = {
    readBool: require('./bool/bool.cjs').Read,
    readByte: require('./byte/byte.cjs').Read,
    readUByte: require('./ubyte/ubyte.cjs').Read,
    readShort: require('./short/short.cjs').Read,
    readFixed5Short: require('./fixed5short/fixed5short.cjs').Read,
    readInt: require('./int/int.cjs').Read,
    readLong: require('./long/long.cjs').Read,
    readFloat: require('./float/float.cjs').Read,
    readDouble: require('./double/double.cjs').Read,
    readString: require('./string/string.cjs').Read
}