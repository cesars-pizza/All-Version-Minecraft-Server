module.exports = {
    readBool: require('./bool/bool.cjs').Read,
    readByte: require('./number/byte/byte.cjs').Read,
    readUByte: require('./number/ubyte/ubyte.cjs').Read,
    readShort: require('./number/short/short.cjs').Read,
    readFixed5Short: require('./number/fixed5short/fixed5short.cjs').Read,
    readInt: require('./number/int/int.cjs').Read,
    readLong: require('./number/long/long.cjs').Read,
    readFloat: require('./number/float/float.cjs').Read,
    readDouble: require('./number/double/double.cjs').Read,
    readString: require('./string/string.cjs').Read,
}