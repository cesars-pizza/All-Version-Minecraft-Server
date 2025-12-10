const {Socket} = require('../../../data_structures.cjs')

function Read(data, position) {
    for (var i = position; i < position + 8; i++) {
        if (data[i] == undefined) return {
            value: undefined,
            length: 8,
            nextPos: position + 8
        }
    }

    var value = 0n
    value += BigInt(data[position + 0]) * 0x0100000000000000n
    value += BigInt(data[position + 1]) * 0x0001000000000000n
    value += BigInt(data[position + 2]) * 0x0000010000000000n
    value += BigInt(data[position + 3]) * 0x0000000100000000n
    value += BigInt(data[position + 4]) * 0x0000000001000000n
    value += BigInt(data[position + 5]) * 0x0000000000010000n
    value += BigInt(data[position + 6]) * 0x0000000000000100n
    value += BigInt(data[position + 7]) * 0x0000000000000001n
    if (value > 9223372036854775807n) value -= 18446744073709551616n

    return {
        value: value,
        length: 8,
        nextPos: position + 8
    }

    // Returns undefined at EOF
}

function Write(value) {
    value = BigInt(value)
    if (value < 0) value += 18446744073709551616n

    var bytes = [
        Number((value & 0xFF00000000000000n) / 0x0100000000000000n),
        Number((value & 0x00FF000000000000n) / 0x0001000000000000n),
        Number((value & 0x0000FF0000000000n) / 0x0000010000000000n),
        Number((value & 0x000000FF00000000n) / 0x0000000100000000n),
        Number((value & 0x00000000FF000000n) / 0x0000000001000000n),
        Number((value & 0x0000000000FF0000n) / 0x0000000000010000n),
        Number((value & 0x000000000000FF00n) / 0x0000000000000100n),
        Number((value & 0x00000000000000FFn) / 0x0000000000000001n),
    ]

    return bytes
}

module.exports = {Read, Write}