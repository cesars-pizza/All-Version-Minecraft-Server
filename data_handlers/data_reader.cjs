module.exports = {
    readByte: require('./byte/byte.cjs').Read,
    readUByte: require('./ubyte/ubyte.cjs').Read,
    readShort: require('./short/short.cjs').Read,
    readFixed5Short: require('./fixed5short/fixed5short.cjs').Read,
    readString: require('./string/string.cjs').Read
}