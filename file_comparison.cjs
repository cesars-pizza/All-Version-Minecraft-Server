const fs = require('fs')

var file1 = fs.readFileSync('./debug/levelDataCompressed.gz')
var file2 = fs.readFileSync('./debug/levelDataCompressedReal.gz')

var text = "./debug/levelDataCompressed.gz\n./debug/levelDataCompressedReal.gz\n\n"

var length1 = file1.length
var length2 = file2.length

var lineCount1 = Math.ceil(length1 / 16)
var lineCount2 = Math.ceil(length2 / 16)
var smallestLineCount = Math.min(lineCount1, lineCount2)
var largestLineCount = Math.max(lineCount1, lineCount2)
var addressLength = (largestLineCount - 1).toString(16).length

if (length1 != length2) text += `Length: ${length1} bytes\nLength: ${length2} bytes\n\n`

for (var i = 0; i < smallestLineCount; i++) {
    var line1 = Array.from(file1.subarray(i * 16, (i + 1) * 16))
    var line2 = Array.from(file2.subarray(i * 16, (i + 1) * 16))

    var isDifferent = line1.length != line2.length
    if (!isDifferent) {
        for (var j = 0; j < line1.length; j++) {
            isDifferent |= (line1[j] != line2[j])
        }
    }
    isDifferent = Boolean(isDifferent)

    if (isDifferent) {
        var address = i.toString(16).padStart(addressLength, '0') + '0'
        
        var line1Bytes = line1.map(value => value.toString(16).padStart(2, '0')).join(' ')
        var line2Bytes = line2.map(value => value.toString(16).padStart(2, '0')).join(' ')

        var line1Ascii = line1.map(byte => (byte >= 32 && byte <= 126) ? String.fromCharCode(byte) : '.').join('');
        var line2Ascii = line2.map(byte => (byte >= 32 && byte <= 126) ? String.fromCharCode(byte) : '.').join('');

        text += `${address}    ${line1Bytes}    ${line1Ascii}\n${address}    ${line2Bytes}    ${line2Ascii}\n\n`
    }
}

if (smallestLineCount != largestLineCount) {
    var addressString = largestLineCount.toString(16).padStart(addressLength, '0') + '0'

    if (lineCount1 == largestLineCount) var line = Array.from(file1.subarray(largestLineCount * 16))
    var lineBytes = line.map(value => value.toString(16).padStart(2, '0')).join(' ')    
    var lineAscii = line.map(byte => (byte >= 32 && byte <= 126) ? String.fromCharCode(byte) : '.').join('');

    if (lineCount1 == largestLineCount) {
        text += `${addressString}    ${lineBytes}    ${lineAscii}`
        text += `${addressString}    End of File                                         End of File`
    } else {
        text += `${addressString}    End of File                                         End of File`
        text += `${addressString}    ${lineBytes}    ${lineAscii}`
    }
}

fs.writeFileSync('./debug/hex_compression_dump.txt', text)