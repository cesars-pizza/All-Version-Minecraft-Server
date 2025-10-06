const fs = require('fs')

var data = fs.readFileSync('./serverdata.bin')

var position = 0
var packetsRaw = []

var chunkXMin = Infinity
var chunkXMax = -Infinity
var chunkZMin = Infinity
var chunkZMax = -Infinity
var chunks = []

var blockChanges = []

var playerID = 12345
var entities = []

var packetCounts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

while(position < data.length) {
    if (data[position] == 0) {
        position++
        packetsRaw.push(0)
        packetCounts[0]++
    } else if (data[position] == 1) {
        position += 1
        playerID = data[position] * 16777216 + data[position + 1] * 65536 + data[position + 2] * 256 + data[position + 3]
        position += 4
        position += data[position] * 256 + data[position + 1] + 2
        position += data[position] * 256 + data[position + 1] + 2

        packetsRaw.push(1)
        packetCounts[1]++
    } else if (data[position] == 3) {
        position += 1
        position += data[position] * 256 + data[position + 1] + 2

        packetsRaw.push(3)
        packetCounts[3]++
    } else if (data[position] == 13) {
        position += 42
        packetsRaw.push(13)
        packetCounts[13]++
    } else if (data[position] == 21) {
        position += 23
        packetsRaw.push(21)
        packetCounts[21]++
    } else if (data[position] == 30) {
        position += 1
        entities.push(data[position] * 16777216 + data[position + 1] * 65536 + data[position + 2] * 256 + data[position + 3])
        position += 4
        packetsRaw.push(30)
        packetCounts[30]++
    } else if (data[position] == 31) {
        position += 8

        packetsRaw.push(31)
        packetCounts[31]++
    } else if (data[position] == 50) {
        position += 1
        var chunkX = data[position] * 16777216 + data[position + 1] * 65536 + data[position + 2] * 256 + data[position + 3]
        if (chunkX >= 0x80000000) chunkX -= 0x100000000
        position += 4
        var chunkZ = data[position] * 16777216 + data[position + 1] * 65536 + data[position + 2] * 256 + data[position + 3]
        if (chunkZ >= 0x80000000) chunkZ -= 0x100000000
        position += 5

        chunkXMin = Math.min(chunkX, chunkXMin)
        chunkXMax = Math.max(chunkX, chunkXMax)
        chunkZMin = Math.min(chunkZ, chunkZMin)
        chunkZMax = Math.max(chunkZ, chunkZMax)

        chunks.push({x: chunkX, z: chunkZ})

        packetsRaw.push(50)
        packetCounts[50]++
    } else if (data[position] == 51) {
        position += 14
        position += data[position] * 16777216 + data[position + 1] * 65536 + data[position + 2] * 256 + data[position + 3] + 4
        packetsRaw.push(51)
        packetCounts[51]++
    } else if (data[position] == 52) {
        position += 1
        var chunkX = data[position] * 16777216 + data[position + 1] * 65536 + data[position + 2] * 256 + data[position + 3]
        if (chunkX >= 0x80000000) chunkX -= 0x100000000
        position += 4
        var chunkZ = data[position] * 16777216 + data[position + 1] * 65536 + data[position + 2] * 256 + data[position + 3]
        if (chunkZ >= 0x80000000) chunkZ -= 0x100000000
        position += 4

        var count = data[position] * 256 + data[position + 1]
        position += 2

        var changes = []
        for (var i = 0; i < count; i++) {
            changes.push({x: chunkX * 16 + ((data[position] & 0xf0) >> 4), y: data[position + 1], z: chunkZ * 16 + (data[position] & 0x0f), multi: true})
            position += 2
        }
        for (var i = 0; i < count; i++) {
            changes[i].id = data[position]
            position += 1
        }
        for (var i = 0; i < count; i++) {
            changes[i].meta = data[position]
            position += 1
        }

        blockChanges = blockChanges.concat(changes)

        packetsRaw.push(52)
        packetCounts[52]++
    } else if (data[position] == 53) {
        position += 1
        var blockPosX = data[position] * 16777216 + data[position + 1] * 65536 + data[position + 2] * 256 + data[position + 3]
        if (blockPosX >= 0x80000000) blockPosX -= 0x100000000
        position += 4
        var blockPosY = data[position]
        position += 1
        var blockPosZ = data[position] * 16777216 + data[position + 1] * 65536 + data[position + 2] * 256 + data[position + 3]
        if (blockPosZ >= 0x80000000) blockPosZ -= 0x100000000
        position += 4
        var blockType = data[position]
        position += 1
        var blockMeta = data[position]
        position += 1

        blockChanges.push({x: blockPosX, y: blockPosY, z: blockPosZ, id: blockType, meta: blockMeta, multi: false})

        packetsRaw.push(53)
        packetCounts[53]++
    } else {
        packetsRaw.push(data[position])
        position = data.length
    }
}

var packetsCompressed = [{id: packetsRaw[0], count: 1}]
for (var i = 1; i < packetsRaw.length; i++) {
    if (packetsRaw[i] == packetsCompressed[packetsCompressed.length - 1].id) packetsCompressed[packetsCompressed.length - 1].count++
    else packetsCompressed.push({id: packetsRaw[i], count: 1})
}

var log = ""
for (var i = 0; i < packetsCompressed.length; i++) {
    var countText = `(x${packetsCompressed[i].count.toString().padStart(4, '0')})`

    if (packetsCompressed[i].id == 0) log += `${countText} 000 / Keep Alive\n`
    else if (packetsCompressed[i].id == 1) log += `${countText} 001 / Login Response\n`
    else if (packetsCompressed[i].id == 3) log += `${countText} 003 / Chat Message\n`
    else if (packetsCompressed[i].id == 13) log += `${countText} 013 / Player Position & Look\n`
    else if (packetsCompressed[i].id == 21) log += `${countText} 021 / Pickup Spawn\n`
    else if (packetsCompressed[i].id == 30) log += `${countText} 030 / Entity\n`
    else if (packetsCompressed[i].id == 31) log += `${countText} 031 / Entity Relative Move\n`
    else if (packetsCompressed[i].id == 50) log += `${countText} 050 / Pre-Chunk\n`
    else if (packetsCompressed[i].id == 51) log += `${countText} 051 / Map Chunk\n`
    else if (packetsCompressed[i].id == 52) log += `${countText} 052 / Multi Block Change\n`
    else if (packetsCompressed[i].id == 53) log += `${countText} 053 / Block Change\n`
    else log += `(x0001) ${packetsCompressed[i].id.toString().padStart(3, '0')} / Unknown\n`
}

log += `\nChunkX: ${(chunkXMin + chunkXMax) / 2}:${((chunkXMax - chunkXMin)) / 2}`
log += `\nChunkZ: ${(chunkZMin + chunkZMax) / 2}:${((chunkZMax - chunkZMin)) / 2}\n\n`

for (var i = 0; i < chunks.length; i++) {
    log += `Chunk: (${chunks[i].x}, ${chunks[i].z})\n`
}

log += "\n"
for (var i = 0; i < blockChanges.length; i++) {
    log += `${blockChanges[i].multi ? "M" : " "}BC: (${blockChanges[i].x}, ${blockChanges[i].y}, ${blockChanges[i].z}) => ${blockChanges[i].id}:${blockChanges[i].meta}\n`
}

log += `\nPlayer: ${playerID}\n`
for (var i = 0; i < entities.length; i++) {
    log += `Entity: ${entities[i]}\n`
}

log += `\nKeep Alive: ${packetCounts[0]}\n`
log += `Login Response: ${packetCounts[1]}\n`
log += `Chat Message: ${packetCounts[3]}\n`
log += `Player Position & Look: ${packetCounts[13]}\n`
log += `Pickup Spawn: ${packetCounts[21]}\n`
log += `Entity: ${packetCounts[30]}\n`
log += `Pre-Chunk: ${packetCounts[50]}\n`
log += `Map Chunk: ${packetCounts[51]}\n`
log += `Multi Block Change: ${packetCounts[52]}\n`
log += `Block Change: ${packetCounts[53]}\n`

fs.writeFileSync("./serverpackets2.txt", Buffer.from(log))