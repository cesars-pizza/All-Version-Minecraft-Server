const net = require('net')
const fs = require('fs')
const {Socket, Config, World} = require('./data_structures.cjs')
const packetReader = require('./data_handlers/serverbound_packets/packet_reader.cjs')
const dataWriter = require('./data_handlers/data_writer.cjs')
const utils = require('./utils/utils.cjs')

var socketIndex = 0

/**
 * @type {World}
 */
var world = {
    config: new Config(),
    players: [],
    maxPlayerCount: 0,
    loadingPlayerNames: [],
    loadedPlayers: [],
    registries: {
        block: []
    },
    builds: [],
    blockUpdates: [],
    disconnectedPlayers: []
}

setupLogs()
loadConfig()
loadWorld()

async function loadWorld() {
    var playerFiles = fs.opendirSync('./world/players')
    var endOfPlayers = false
    while (!endOfPlayers) {
        var thisPlayer = playerFiles.readSync()
        if (thisPlayer == null) endOfPlayers = true
        else {
            if (thisPlayer.isFile() && thisPlayer.name.endsWith('.json')) {
                world.players.push(JSON.parse(fs.readFileSync(`./world/players/${thisPlayer.name}`)))
            }
        }
    }
    console.log(`WORLD Loaded ${world.players.length} Players`)
    playerFiles.closeSync()

    var blockRegistry = fs.opendirSync('./world/registries/block')
    var endofRegistry = false
    while (!endofRegistry) {
        var thisRegistry = blockRegistry.readSync()
        if (thisRegistry == null) endofRegistry = true
        else {
            if (thisRegistry.isFile()) {
                var nameNumber = Number(thisRegistry.name.replace('.json', ''))
                if (thisRegistry.name.endsWith('.json') && nameNumber != NaN) {
                    world.registries.block.push(JSON.parse(fs.readFileSync(`./world/registries/block/${thisRegistry.name}`)))
                }
            }
        }
    }
    console.log(`WORLD Loaded ${world.registries.block.length} Block Registries`)
    blockRegistry.closeSync()

    var buildFiles = fs.opendirSync('./world/builds')
    var endOfBuilds = false
    while (!endOfBuilds) {
        var thisBuild = buildFiles.readSync()
        if (thisBuild == null) endOfBuilds = true
        else {
            if (thisBuild.isFile() && thisBuild.name.endsWith('.json')) {
                world.builds.push(JSON.parse(fs.readFileSync(`./world/builds/${thisBuild.name}`)))
            }
        }
    }
    console.log(`WORLD Loaded ${world.builds.length} Builds`)
    buildFiles.closeSync()
}

async function loadConfig() {
    world.config = JSON.parse(fs.readFileSync('./config.json'))
    
    world.maxPlayerCount = world.config.maxPlayers
    if (world.config.minUPVN <= 83) maxPlayerCount = Math.min(world.maxPlayerCount, 128) // Need to test when this becomes 255
}

async function setupLogs() {
    if (fs.existsSync("./logs")) await fs.rmSync("./logs", {recursive: true}, () => {})
    await fs.mkdir("./logs", () => {})

    if (fs.existsSync("./debug")) await fs.rmSync("./debug", {recursive: true}, () => {})
    await fs.mkdir("./debug", () => {})
}

const server = net.createServer(/** @param {Socket} socket */ (socket) => {
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
    socket.setDisconnect = (disconnectReason, consoleLog) => {
        socket.disconnect = disconnectReason
        if (consoleLog != false) socket.log("DISCONNECT " + disconnectReason)
    }

    socket.packetCount = 0
    socket.identified = false
    socket.upvn = -2
    socket.uvni = -1

    socket.dataBuffer = Buffer.alloc(0)

    socket.thisPlayer = {
        uuid: "",
        username: "",
        position: {x: 0, y: 1, z: 0},
        rotation: {pitch: 0, yaw: 0},
        inventory: {
            selected_slot: 0,
            slots: []
        },
        verified: false,
        keepVerified: false,
        lastUVNI: -1,

        classicID: -1,
        inWorld: false,
        tick: {spawn: true, position: false, rotation: false},
        save: false,
        upvn: -2,
        uvni: -1
    }
    
    socket.disconnect = ""

    if (world.loadingPlayerNames.length + world.loadedPlayers.length >= world.maxPlayerCount) {
        socket.setDisconnect("maxPlayers")
    }
    world.loadingPlayerNames.push("")

    socket.on('data', (data) => {
        ReadPacket(socket, data)
    });

    socket.on('end', () => {
        clearInterval(socket.keepAlive)
        socket.log("", false)
        socket.log("Closed Socket")
        fs.writeFileSync(`./logs/log${socket.index.toString().padStart(5,'0')}.txt`, socket.logText)
        world.disconnectedPlayers.push({classicID: socket.thisPlayer.classicID})
        world.loadedPlayers.splice(world.loadedPlayers.map(player => player.username).indexOf(socket.thisPlayer.username), 1)
    })
    
    socket.on('error', (err) => {
        clearInterval(socket.keepAlive)
        socket.log("", false)
        socket.log(`Socket Error: ${err.message}`);
        fs.writeFileSync(`./logs/log${socket.index.toString().padStart(5,'0')}.txt`, socket.logText)
        world.disconnectedPlayers.push({classicID: socket.thisPlayer.classicID})
        world.loadedPlayers.splice(world.loadedPlayers.map(player => player.username).indexOf(socket.thisPlayer.username), 1)
    })
});

server.listen(25565, () => {
    console.log('TCP server listening on port 25565');
});

server.on('error', (err) => {
  console.error(`Server Error: ${err.message}`);
  throw err;
});

setInterval(ServerTick, 50)
function ServerTick() {
    for (var i = 0; i < world.loadedPlayers.length; i++) {
        if (world.loadedPlayers[i].tick.spawn) {
            for (var j = 0; j < world.loadedPlayers.length; j++) {
                if (i != j) {
                    utils.tick_actions.spawn_player(world.loadedPlayers[j].socket)(world.loadedPlayers[j].socket, world.loadedPlayers[i].classicID, world.loadedPlayers[i].username, world.loadedPlayers[i].position, world.loadedPlayers[i].rotation)
                }
            }
            world.loadedPlayers[i].tick.spawn = false
        }
        if (world.loadedPlayers[i].tick.position && world.loadedPlayers[i].tick.rotation) {
            for (var j = 0; j < world.loadedPlayers.length; j++) {
                if (i != j) {
                    utils.tick_actions.move_player_pos_rot(world.loadedPlayers[j].socket)(world.loadedPlayers[j].socket, world.loadedPlayers[i].classicID, world.loadedPlayers[i].position, world.loadedPlayers[i].rotation)
                }
            }
            world.loadedPlayers[i].tick.position = false
            world.loadedPlayers[i].tick.rotation = false
        } else if (world.loadedPlayers[i].tick.position) {
            for (var j = 0; j < world.loadedPlayers.length; j++) {
                if (i != j) {
                    utils.tick_actions.move_player_pos(world.loadedPlayers[j].socket)(world.loadedPlayers[j].socket, world.loadedPlayers[i].classicID, world.loadedPlayers[i].position, world.loadedPlayers[i].rotation)
                }
            }
            world.loadedPlayers[i].tick.position = false
        } else if (world.loadedPlayers[i].tick.rotation) {
            for (var j = 0; j < world.loadedPlayers.length; j++) {
                if (i != j) {
                    utils.tick_actions.move_player_rot(world.loadedPlayers[j].socket)(world.loadedPlayers[j].socket, world.loadedPlayers[i].classicID, world.loadedPlayers[i].position, world.loadedPlayers[i].rotation)
                }
            }
            world.loadedPlayers[i].tick.rotation = false
        }

        for (var j = 0; j < world.blockUpdates.length; j++) {
            utils.tick_actions.set_block.SetBlock(world.loadedPlayers[i].socket)(world, world.loadedPlayers[i].socket, world.blockUpdates[j], world.blockUpdates[j].id)
        }

        for (var j = 0; j < world.disconnectedPlayers.length; j++) {
            utils.tick_actions.despawn_player(world.loadedPlayers[i].socket)(world.loadedPlayers[i].socket, world.disconnectedPlayers[j].classicID)
        }
    }
    world.blockUpdates = []
    world.disconnectedPlayers = []
}

setInterval(ServerSave, 10000)
function ServerSave() {
    console.log("WORLD Saved")

    var savedPlayerCount = 0
    for (var i = 0; i < world.players.length; i++) {
        if (world.players[i].save) {
            savedPlayerCount++
            var thisPlayerSocket = world.players[i].socket
            world.players[i].socket = undefined
            fs.writeFileSync(`./world/players/${world.players[i].username}.json`, JSON.stringify(world.players[i]))
            world.players[i].socket = thisPlayerSocket
            world.players[i].save = false
        }
    }
    if (savedPlayerCount > 0) console.log(`WORLD Saved ${savedPlayerCount} Players`)

    var savedBuildCount = 0
    for (var i = 0; i < world.builds.length; i++) {
        if (world.builds[i].save) {
            savedBuildCount++
            fs.writeFileSync(`./world/builds/${world.builds[i].x},${world.builds[i].z}.json`, JSON.stringify(world.builds[i]))
            world.builds[i].save = false
        }
    }
    if (savedBuildCount > 0) console.log(`WORLD Saved ${savedBuildCount} Builds`)
}

/** 
 * @param {Socket} socket 
 * @param {Buffer} data
 */
function ReadPacket(socket, data) {
    socket.packetCount++

    if (!socket.identified) IdentifyVersion(socket, data)
    var packetID = GetPacketID(socket, data)

    var packetReaderFn = packetReader[packetID]

    if (packetID != null && socket.identified) {
        if (packetReaderFn != undefined) {
            var splitIndex = packetReaderFn(socket)(world, socket, data)
            if (splitIndex > 0) ReadPacket(socket, data.subarray(data.length - splitIndex))
            else if (splitIndex < 0) socket.dataBuffer = Buffer.from(Array.from(socket.dataBuffer).concat(Array.from(data)))
        }
        else {
            HexViewBytes(data, `unknown-packet`)
            socket.log(`SERVERBOUND --> ${packetID} "Unknown" / ${data.length} bytes`)
        }
    }
    else socket.destroy()
}

/**
 * @param {Socket} socket 
 * @param {Buffer} data 
 */
function IdentifyVersion(socket, data) {
    if (socket.packetCount == 1 && data[0] == 0x00) {
        socket.log(`IDENTIFIED UPVN -1`)
        socket.log(`IDENTIFIED UVNI 29 / 0.0.15a (Multiplayer Test 1)`)
        socket.identified = true
        socket.thisPlayer.upvn = -1
        socket.thisPlayer.uvni = 29

        if (world.config.minUPVN > -1) socket.setDisconnect("invalidVersion")
    }
}

function GetPacketID(socket, data) {
    if (socket.identified && socket.thisPlayer.upvn < 0) return data[0]
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