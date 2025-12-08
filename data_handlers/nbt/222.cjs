const {Socket} = require('../../data_structures.cjs')
const dataWriter = require('../data_writer.cjs')
const dataReader = require('../data_reader.cjs')

function Read(socket, data, position) {
    var typeID = data[position]

    if (typeID == 0) {
        return {
            id: typeID,
            length: 1,
            nextPos: position + 1
        }
    } else if (typeID == 1) {
        var name = dataReader.readString(socket, data, position + 1)
        var value = dataReader.readByte(socket, data, name.nextPos)

        return {
            id: typeID,
            value: value.value,
            name: name.value,
            length: name.length + 2,
            nextPos: position + name.length + 2
        }
    } else if (typeID == 2) {
        var name = dataReader.readString(socket, data, position + 1)
        var value = dataReader.readShort(socket, data, name.nextPos)

        return {
            id: typeID,
            value: value.value,
            name: name.value,
            length: name.length + 3,
            nextPos: position + name.length + 3
        }
    } else if (typeID == 3) {
        var name = dataReader.readString(socket, data, position + 1)
        var value = dataReader.readInt(socket, data, name.nextPos)

        return {
            id: typeID,
            value: value.value,
            name: name.value,
            length: name.length + 5,
            nextPos: position + name.length + 5
        }
    } else if (typeID == 4) {
        var name = dataReader.readString(socket, data, position + 1)
        var value = dataReader.readLong(socket, data, name.nextPos)

        return {
            id: typeID,
            value: value.value,
            name: name.value,
            length: name.length + 9,
            nextPos: position + name.length + 9
        }
    } else if (typeID == 5) {
        var name = dataReader.readString(socket, data, position + 1)
        var value = dataReader.readFloat(socket, Buffer.from(data), name.nextPos)

        return {
            id: typeID,
            value: value.value,
            name: name.value,
            length: name.length + 5,
            nextPos: position + name.length + 5
        }
    } else if (typeID == 6) {
        var name = dataReader.readString(socket, data, position + 1)
        var value = dataReader.readDouble(socket, Buffer.from(data), name.nextPos)

        return {
            id: typeID,
            value: value.value,
            name: name.value,
            length: name.length + 9,
            nextPos: position + name.length + 9
        }
    } else if (typeID == 7) {
        var name = dataReader.readString(socket, data, position + 1)
        var length = dataReader.readInt(socket, data, name.nextPos)
        var pointer = length.nextPos
        var values = []
        for (var i = 0; i < length.value; i++) {
            var thisValue = dataReader.readByte(socket, data, pointer)
            values.push(thisValue.value)
            pointer = thisValue.nextPos
        }

        return {
            id: typeID,
            value: values,
            name: name.value,
            length: pointer - position,
            nextPos: pointer
        }
    } else if (typeID == 8) {
        var name = dataReader.readString(socket, data, position + 1)
        var value = dataReader.readString(socket, data, name.nextPos)

        return {
            id: typeID,
            value: value.value,
            name: name.value,
            length: name.length + value.length + 1,
            nextPos: position + name.length + value.length + 1
        }
    } else if (typeID == 9) {
        var name = dataReader.readString(socket, data, position + 1)
        var itemType = dataReader.readByte(socket, data, name.nextPos)
        var length = dataReader.readInt(socket, data, itemType.nextPos)
        var pointer = length.nextPos
        var values = []
        for (var i = 0; i < length.value; i++) {
            var thisValue = ReadInList(socket, data, pointer, itemType.value)
            values.push(thisValue.value)
            pointer = thisValue.nextPos
        }

        return {
            id: typeID,
            type: itemType.value,
            value: values,
            name: name.value,
            length: pointer - position,
            nextPos: pointer
        }
    } else if (typeID == 10) {
        var name = dataReader.readString(socket, data, position + 1)
        var pointer = name.nextPos
        var reachedEnd = false
        var values = {}
        while (!reachedEnd) {
            var thisValue = Read(socket, data, pointer)

            if (thisValue.id == 0) reachedEnd = true
            else if (thisValue.id == 9) values[thisValue.name] = {
                id: thisValue.id,
                type: thisValue.type,
                value: thisValue.value
            }
            else values[thisValue.name] = {
                id: thisValue.id,
                value: thisValue.value
            }
            pointer = thisValue.nextPos
        }

        return {
            id: typeID,
            value: values,
            name: name.value,
            length: pointer - position,
            nextPos: pointer
        }
    } else if (typeID == 11) {
        var name = dataReader.readString(socket, data, position + 1)
        var length = dataReader.readInt(socket, data, name.nextPos)
        var pointer = length.nextPos
        var values = []
        for (var i = 0; i < length.value; i++) {
            var thisValue = dataReader.readInt(socket, data, pointer)
            values.push(thisValue.value)
            pointer = thisValue.nextPos
        }

        return {
            id: typeID,
            value: values,
            name: name.value,
            length: pointer - position,
            nextPos: pointer
        }
    } else if (typeID == 12) {
        var name = dataReader.readString(socket, data, position + 1)
        var length = dataReader.readInt(socket, data, name.nextPos)
        var pointer = length.nextPos
        var values = []
        for (var i = 0; i < length.value; i++) {
            var thisValue = dataReader.readLong(socket, data, pointer)
            values.push(thisValue.value)
            pointer = thisValue.nextPos
        }

        return {
            id: typeID,
            value: values,
            name: name.value,
            length: pointer - position,
            nextPos: pointer
        }
    }
}

function ReadInList(socket, data, position, typeID) {
    if (typeID == 0) {
        return {
            id: typeID,
            length: 0,
            nextPos: position + 0
        }
    } else if (typeID == 1) {
        var value = dataReader.readByte(socket, data, position)

        return {
            id: typeID,
            value: value.value,
            length: 1,
            nextPos: position + 1
        }
    } else if (typeID == 2) {
        var value = dataReader.readShort(socket, data, position)

        return {
            id: typeID,
            value: value.value,
            length: 2,
            nextPos: position + 2
        }
    } else if (typeID == 3) {
        var value = dataReader.readInt(socket, data, position)

        return {
            id: typeID,
            value: value.value,
            length: 4,
            nextPos: position + 4
        }
    } else if (typeID == 4) {
        var value = dataReader.readLong(socket, data, position)

        return {
            id: typeID,
            value: value.value,
            length: 8,
            nextPos: position + 8
        }
    } else if (typeID == 5) {
        var value = dataReader.readFloat(socket, Buffer.from(data), position)

        return {
            id: typeID,
            value: value.value,
            length: 4,
            nextPos: position + 4
        }
    } else if (typeID == 6) {
        var value = dataReader.readDouble(socket, Buffer.from(data), position)

        return {
            id: typeID,
            value: value.value,
            length: 8,
            nextPos: position + 8
        }
    } else if (typeID == 7) {
        var length = dataReader.readInt(socket, data, position)
        var pointer = length.nextPos
        var values = []
        for (var i = 0; i < length.value; i++) {
            var thisValue = dataReader.readByte(socket, data, pointer)
            values.push(thisValue.value)
            pointer = thisValue.nextPos
        }

        return {
            id: typeID,
            value: values,
            length: pointer - position,
            nextPos: pointer
        }
    } else if (typeID == 8) {
        var value = dataReader.readString(socket, data, position)

        return {
            id: typeID,
            value: value.value,
            length: value.length,
            nextPos: position + value.length
        }
    } else if (typeID == 9) {
        var itemType = dataReader.readByte(socket, data, position)
        var length = dataReader.readInt(socket, data, itemType.nextPos)
        var pointer = length.nextPos
        var values = []
        for (var i = 0; i < length.value; i++) {
            var thisValue = ReadInList(socket, data, pointer, itemType.value)
            values.push(thisValue.value)
            pointer = thisValue.nextPos
        }

        return {
            id: typeID,
            type: itemType.value,
            value: values,
            length: pointer - position,
            nextPos: pointer
        }
    } else if (typeID == 10) {
        var pointer = position
        var reachedEnd = false
        var values = {}
        while (!reachedEnd) {
            var thisValue = Read(socket, data, pointer)
            if (thisValue.id == 0) reachedEnd = true
            else if (thisValue.id == 9) values[thisValue.name] = {
                id: thisValue.id,
                type: thisValue.type,
                value: thisValue.value
            }
            else values[thisValue.name] = {
                id: thisValue.id,
                value: thisValue.value
            }
            pointer = thisValue.nextPos
        }

        return {
            id: typeID,
            value: values,
            length: pointer - position,
            nextPos: pointer
        }
    } else if (typeID == 11) {
        var length = dataReader.readInt(socket, data, position)
        var pointer = length.nextPos
        var values = []
        for (var i = 0; i < length.value; i++) {
            var thisValue = dataReader.readInt(socket, data, pointer)
            values.push(thisValue.value)
            pointer = thisValue.nextPos
        }

        return {
            id: typeID,
            value: values,
            length: pointer - position,
            nextPos: pointer
        }
    } else if (typeID == 12) {
        var length = dataReader.readInt(socket, data, position)
        var pointer = length.nextPos
        var values = []
        for (var i = 0; i < length.value; i++) {
            var thisValue = dataReader.readLong(socket, data, pointer)
            values.push(thisValue.value)
            pointer = thisValue.nextPos
        }

        return {
            id: typeID,
            value: values,
            length: pointer - position,
            nextPos: pointer
        }
    }
}

function WriteNBT(name, values, isList, isCompound) {
    if (isList == undefined) isList = false
    if (isCompound == undefined) isCompound = false

    var rootData = []
    if (!isList && !isCompound) {
        var rootDecodedName = dataWriter.writeString({thisPlayer: {upvn: 8}}, name)
        rootData = [0x0a].concat(rootDecodedName)
    }

    var valueKeys = Object.keys(values)
    for (var i = 0; i < valueKeys.length; i++) {
        if (!isList) {
            rootData = rootData.concat([values[valueKeys[i]].id])

            var decodedName = dataWriter.writeString({thisPlayer: {upvn: 8}}, valueKeys[i])
            if (values[valueKeys[i]].id >= 1 && values[valueKeys[i]].id <= 12) {
                rootData = rootData.concat(decodedName)
            }
        }

        if (values[valueKeys[i]].id == 1) rootData = rootData.concat(dataWriter.writeByte(undefined, values[valueKeys[i]].value))
        else if (values[valueKeys[i]].id == 2) rootData = rootData.concat(dataWriter.writeShort(undefined, values[valueKeys[i]].value))
        else if (values[valueKeys[i]].id == 3) rootData = rootData.concat(dataWriter.writeInt(undefined, values[valueKeys[i]].value))
        else if (values[valueKeys[i]].id == 4) rootData = rootData.concat(dataWriter.writeLong(undefined, values[valueKeys[i]].value))
        else if (values[valueKeys[i]].id == 5) rootData = rootData.concat(dataWriter.writeFloat(undefined, values[valueKeys[i]].value))
        else if (values[valueKeys[i]].id == 6) rootData = rootData.concat(dataWriter.writeDouble(undefined, values[valueKeys[i]].value))
        else if (values[valueKeys[i]].id == 7) rootData = rootData.concat(dataWriter.writeInt(undefined, values[valueKeys[i]].value.length), values[valueKeys[i]].value.map(item => dataWriter.writeByte(undefined, item)).flat())
        else if (values[valueKeys[i]].id == 8) {
            var decodedValue = dataWriter.writeString({thisPlayer: {upvn: 8}}, values[valueKeys[i]].value)
            rootData = rootData.concat(decodedValue)
        }
        else if (values[valueKeys[i]].id == 9) rootData = rootData.concat(dataWriter.writeByte(undefined, values[valueKeys[i]].type), dataWriter.writeInt(undefined, values[valueKeys[i]].value.length), WriteNBT("", values[valueKeys[i]].value, true, false))
        else if (values[valueKeys[i]].id == 10) rootData = rootData.concat(WriteNBT("", values[valueKeys[i]].value, false, true))
        else if (values[valueKeys[i]].id == 11) rootData = rootData.concat(dataWriter.writeInt(undefined, values[valueKeys[i]].value.length), values[valueKeys[i]].value.map(item => dataWriter.writeInt(undefined, item)).flat())
        else if (values[valueKeys[i]].id == 12) rootData = rootData.concat(dataWriter.writeInt(undefined, values[valueKeys[i]].value.length), values[valueKeys[i]].value.map(item => dataWriter.writeLong(undefined, item)).flat())
    }

    if (isList) return rootData
    return rootData.concat([0x00])
}

function WriteTag_End() {
    return {
        id: 0
    }
}

function WriteTag_Byte(value) {
    return {
        id: 1,
        value: value
    }
}

function WriteTag_Short(value) {
    return {
        id: 2,
        value: value
    }
}

function WriteTag_Int(value) {
    return {
        id: 3,
        value: value
    }
}

function WriteTag_Long(value) {
    return {
        id: 4,
        value: value
    }
}

function WriteTag_Float(value) {
    return {
        id: 5,
        value: value
    }
}

function WriteTag_Double(value) {
    return {
        id: 6,
        value: value
    }
}

function WriteTag_Byte_Array(values) {
    return {
        id: 7,
        value: values
    }
}

function WriteTag_String(value) {
    return {
        id: 8,
        value: value
    }
}

function WriteTag_List(values) {
    if (values.length == 0) {
        return {
            id: 9,
            type: 1,
            value: []
        }
    }

    return {
        id: 9,
        type: values[0].id,
        value: values
    }
}

function WriteTag_Compound(values) {
    return {
        id: 10,
        value: values
    }
}

function WriteTag_IntArray(values) {
    return {
        id: 11,
        value: values
    }
}

function WriteTag_LongArray(values) {
    return {
        id: 12,
        value: values
    }
}

module.exports = {WriteNBT, WriteTag_End, WriteTag_Byte, WriteTag_Short, WriteTag_Int, WriteTag_Long, WriteTag_Float, WriteTag_Double, WriteTag_Byte_Array, WriteTag_String, WriteTag_List, WriteTag_Compound, WriteTag_IntArray, WriteTag_LongArray, Read}