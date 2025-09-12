const net = require('net')
const fs = require('fs')
const {Socket} = require('./data_structures.js')
const packetReader = require('./data_handlers/serverbound_packets/packet_reader.js')
const dataWriter = require('./data_handlers/data_writer.js')

var socketIndex = -1

var players = [

]

setupLogs()
async function setupLogs() {
    if (fs.existsSync("./logs")) await fs.rmSync("./logs", {recursive: true}, () => {})
    await fs.mkdir("./logs", () => {})

    if (fs.existsSync("./debug")) await fs.rmSync("./debug", {recursive: true}, () => {})
    await fs.mkdir("./debug", () => {})
}

const server = net.createServer((socket) => {
    socket.logText = ""
    socket.index = socketIndex
    socketIndex++
    socket.log = (message, consoleLog) => {
        socket.logText += message + "\n"
        if (consoleLog != false) console.log("SOCKET " + message)
    }
    socket.writePacket = (id, identifier, data, logBytes, consoleLog) => {
        var packet = dataWriter.writePacket(socket, id, data)
        if (consoleLog != false) socket.log(`CLIENTBOUND <-- ${id} "${identifier}" / ${packet.length} bytes`)
        if (logBytes) socket.log(debug.DebugByteArrayNumbers(packet))
        socket.write(packet, consoleLog)
    }

    socket.packetCount = 0
    socket.identified = false
    socket.upvn = -2
    socket.uvni = -1

    socket.dataBuffer = Buffer.alloc(0)

    socket.on('data', (data) => {
        ReadPacket(socket, data)
    });

    socket.on('end', () => {
        clearInterval(socket.keepAlive)
        socket.log("", false)
        socket.log("Closed Socket")
        fs.writeFileSync(`./logs/log${socket.index.toString().padStart(5,'0')}.txt`, socket.logText)
    })

    socket.on('error', (err) => {
        clearInterval(socket.keepAlive)
        socket.log("", false)
        socket.log(`Socket Error: ${err.message}`);
        fs.writeFileSync(`./logs/log${socket.index.toString().padStart(5,'0')}.txt`, socket.logText)
    })

    socket.keepAlive = setInterval(() => {
        if (socket.state == 'play') socket.writePacket(0x26, "minecraft:keep_alive", writer.WriteLong(-12345))
    }, 15000)
});

server.listen(25565, () => {
    console.log('TCP server listening on port 25565');
});

server.on('error', (err) => {
  console.error(`Server Error: ${err.message}`);
  throw err;
});

/** 
 * @param {Socket} socket 
 * @param {Buffer} data
 */
function ReadPacket(socket, data) {
    HexViewBytes(Array.from(data), `packet${socketIndex}-${socket.packetCount}`)
    socket.packetCount++

    if (!socket.identified) IdentifyVersion(socket, data)
    var packetID = GetPacketID(socket, data)

    var packetReaderFn = packetReader[packetID]

    if (packetID != null && socket.identified) {
        if (packetReaderFn != undefined) {
            var splitIndex = packetReaderFn(socket)(socket, data)
            if (splitIndex > 0) ReadPacket(socket, data.subarray(splitIndex))
            else if (splitIndex < 0) socket.dataBuffer = Buffer.from(Array.from(socket.dataBuffer).concat(Array.from(data)))
        }
        else socket.log(`SERVERBOUND --> ${packetID} "Unknown" / ${data.length} bytes`)
    }
    else socket.destroy()
}

function IdentifyVersion(socket, data) {
    if (socket.packetCount == 1 && data[0] == 0x00) {
        socket.log(`IDENTIFIED VNNM Multiplayer Test 1`)
        socket.log(`IDENTIFIED UPVN -1`)
        socket.log(`IDENTIFIED UVNI 29`)
        socket.identified = true
        socket.upvn = -1
        socket.uvni = 29
    }
}

function GetPacketID(socket, data) {
    if (socket.identified && socket.upvn < 0) return data[0]
    else return null
}

/** 
 * @param {Array} data
 */
function HexViewBytes(data, debugFile) {
    let result = '';
      const bytesPerLine = 16;
      for (let i = 0; i < data.length; i += bytesPerLine) {
        const lineBuffer = data.slice(i, i + bytesPerLine);
        const offset = i.toString(16).padStart(4, '0'); // 8-digit hex offset
        const hexPart = Array.from(lineBuffer)
          .map(byte => byte.toString(16).padStart(2, '0'))
          .join(' ');
        const asciiPart = Array.from(lineBuffer)
          .map(byte => (byte >= 32 && byte <= 126) ? String.fromCharCode(byte) : '.')
          .join('');
        result += `${offset}  ${hexPart.padEnd(bytesPerLine * 3 - 1, ' ')}  ${asciiPart}\n`;
      }
    result = `Length: ${data.length} bytes\n${result}`

    fs.writeFileSync(`./debug/${debugFile}.txt`, result)
}

module.exports = {HexViewBytes}