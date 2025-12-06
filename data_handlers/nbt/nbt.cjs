const {Socket} = require('../../data_structures.cjs')

function WriteNBT(socket, name, values) {
    return require('./222.cjs').WriteNBT(name, values, false, false)
}

function WriteTag_End(socket) {
    return require('./222.cjs').WriteTag_End()
}

function WriteTag_Byte(socket, value) {
    return require('./222.cjs').WriteTag_Byte(value)
}

function WriteTag_Short(socket, value) {
    return require('./222.cjs').WriteTag_Short(value)
}

function WriteTag_Int(socket, value) {
    return require('./222.cjs').WriteTag_Int(value)
}

function WriteTag_Long(socket, value) {
    return require('./222.cjs').WriteTag_Long(value)
}

function WriteTag_Float(socket, value) {
    return require('./222.cjs').WriteTag_Float(value)
}

function WriteTag_Double(socket, value) {
    return require('./222.cjs').WriteTag_Double(value)
}

function WriteTag_Byte_Array(socket, values) {
    return require('./222.cjs').WriteTag_Byte_Array(values)
}

function WriteTag_String(socket, value) {
    return require('./222.cjs').WriteTag_String(value)
}

function WriteTag_List(socket, values) {
    return require('./222.cjs').WriteTag_List(values)
}

function WriteTag_Compound(socket, values) {
    return require('./222.cjs').WriteTag_Compound(values)
}

function WriteTag_IntArray(socket, values) {
    return require('./222.cjs').WriteTag_IntArray(values)
}

function WriteTag_LongArray(socket, values) {
    return require('./222.cjs').WriteTag_LongArray(values)
}

module.exports = {WriteNBT, WriteTag_End, WriteTag_Byte, WriteTag_Short, WriteTag_Int, WriteTag_Long, WriteTag_Float, WriteTag_Double, WriteTag_Byte_Array, WriteTag_String, WriteTag_List, WriteTag_Compound, WriteTag_IntArray, WriteTag_LongArray}