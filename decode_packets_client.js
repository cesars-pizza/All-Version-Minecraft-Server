const fs = require('fs')

var data = fs.readFileSync('./clientdata.bin')

var position = 0
var packetsRaw = []

var playerDiggings = []

var packetCounts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

while(position < data.length) {
    if (data[position] == 0) {
        position++
        packetsRaw.push(0)
        packetCounts[0]++
    } else if (data[position] == 1) {
        position += 5
        position += 2 + data[position] * 256 + data[position + 1]
        position += 2 + data[position] * 256 + data[position + 1]

        packetsRaw.push(1)
        packetCounts[1]++
    } else if (data[position] == 10) {
        position += 2

        packetsRaw.push(10)
        packetCounts[10]++
    } else if (data[position] == 11) {
        position += 34

        packetsRaw.push(11)
        packetCounts[11]++
    } else if (data[position] == 12) {
        position += 10

        packetsRaw.push(12)
        packetCounts[12]++
    } else if (data[position] == 13) {
        position += 42

        packetsRaw.push(13)
        packetCounts[13]++
    } else if (data[position] == 14) {
        position += 1
        var status = data[position]
        position += 1
        var blockPosX = data[position] * 16777216 + data[position + 1] * 65536 + data[position + 2] * 256 + data[position + 3]
        if (blockPosX >= 0x80000000) blockPosX -= 0x100000000
        position += 4
        var blockPosY = data[position]
        position += 1
        var blockPosZ = data[position] * 16777216 + data[position + 1] * 65536 + data[position + 2] * 256 + data[position + 3]
        if (blockPosZ >= 0x80000000) blockPosZ -= 0x100000000
        position += 4
        var face = data[position]
        position += 1

        playerDiggings.push({x: blockPosX, y: blockPosY, z: blockPosZ, face: face, status: status})

        packetsRaw.push(14)
        packetCounts[14]++
    } else if (data[position] == 15) {
        position += 13

        packetsRaw.push(15)
        packetCounts[15]++
    } else if (data[position] == 16) {
        position += 7

        packetsRaw.push(16)
        packetCounts[16]++
    } else if (data[position] == 18) {
        position += 6

        packetsRaw.push(18)
        packetCounts[18]++
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
    else if (packetsCompressed[i].id == 1) log += `${countText} 001 / Login Request\n`
    else if (packetsCompressed[i].id == 10) log += `${countText} 010 / Player\n`
    else if (packetsCompressed[i].id == 11) log += `${countText} 011 / Player Position\n`
    else if (packetsCompressed[i].id == 12) log += `${countText} 012 / Player Look\n`
    else if (packetsCompressed[i].id == 13) log += `${countText} 013 / Player Position & Look\n`
    else if (packetsCompressed[i].id == 14) log += `${countText} 014 / Player Digging\n`
    else if (packetsCompressed[i].id == 15) log += `${countText} 015 / Player Block Placement\n`
    else if (packetsCompressed[i].id == 16) log += `${countText} 016 / Holding Change\n`
    else if (packetsCompressed[i].id == 18) log += `${countText} 018 / Arm Animation\n`
    else log += `(x0001) ${packetsCompressed[i].id.toString().padStart(3, '0')} / Unknown\n`
}

log += "\n"
for (var i = 0; i < playerDiggings.length; i++) {
    log += `DIG: ${playerDiggings[i].status} (${playerDiggings[i].x}, ${playerDiggings[i].y}, ${playerDiggings[i].z}) from ${playerDiggings[i].face}\n`
}

log += `\nKeep Alive: ${packetCounts[0]}\n`
log += `Login Request: ${packetCounts[1]}\n`
log += `Player: ${packetCounts[10]}\n`
log += `Player Position: ${packetCounts[11]}\n`
log += `Player Look: ${packetCounts[12]}\n`
log += `Player Position & Look: ${packetCounts[13]}\n`
log += `Player Digging: ${packetCounts[14]}\n`
log += `Player Block Placement: ${packetCounts[15]}\n`
log += `Holding Change: ${packetCounts[16]}\n`
log += `Arm Animation: ${packetCounts[18]}\n`

fs.writeFileSync("./clientpackets2.txt", Buffer.from(log))