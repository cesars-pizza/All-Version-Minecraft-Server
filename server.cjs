const net = require('net')
const fs = require('fs')
const {Socket, Config, World, Build} = require('./data_structures.cjs')
const packetReader = require('./data_handlers/serverbound_packets/packet_reader.cjs')
const packetWriter = require('./data_handlers/clientbound_packets/packet_writer.cjs')
const dataWriter = require('./data_handlers/data_writer.cjs')
const utils = require('./utils/utils.cjs')

var socketIndex = 0

/**
 * @type {World}
 */
var world = {}

setup()

async function setup() {
    await setupLogs()

    world = await utils.load_world()
    world.serverFunctions.save = ServerSave

    StartServer()
}

async function setupLogs() {
    if (fs.existsSync("./logs")) await fs.rmSync("./logs", {recursive: true}, () => {})
    await fs.mkdir("./logs", () => {})

    if (fs.existsSync("./debug")) await fs.rmSync("./debug", {recursive: true}, () => {})
    await fs.mkdir("./debug", () => {})
}

function StartServer() {
    const server = net.createServer(/** @param {Socket} socket */(socket) => {
        socket.isClosed = false
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
            if (logBytes) HexViewBytes(data, `${socket.index}.${socket.packetCount}`)
            socket.write(packet, consoleLog)
        }
        socket.setDisconnect = (disconnectReason, consoleLog) => {
            socket.disconnect = disconnectReason
            if (consoleLog != false) socket.log("DISCONNECT " + disconnectReason)
        }

        socket.packetCount = 0
        socket.identified = false

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
            if (!socket.isClosed) {
                clearInterval(socket.keepAlive)
                socket.log("", false)
                socket.log("Closed Socket")
                fs.writeFileSync(`./logs/log${socket.index.toString().padStart(5,'0')}.txt`, socket.logText)
                world.disconnectedPlayers.push({classicID: socket.thisPlayer.classicID, username: socket.thisPlayer.username})
                world.loadedPlayers.splice(world.loadedPlayers.map(player => player.username).indexOf(socket.thisPlayer.username), 1)
                socket.isClosed = true
            }
        })
        
        socket.on('error', (err) => {
            if (!socket.isClosed) {
                clearInterval(socket.keepAlive)
                socket.log("", false)
                socket.log(`Socket Error: ${err.message}`);
                fs.writeFileSync(`./logs/log${socket.index.toString().padStart(5,'0')}.txt`, socket.logText)
                world.disconnectedPlayers.push({classicID: socket.thisPlayer.classicID, username: socket.thisPlayer.username})
                world.loadedPlayers.splice(world.loadedPlayers.map(player => player.username).indexOf(socket.thisPlayer.username), 1)
                socket.isClosed = true
            }
        })
    });

    server.listen(world.config.hostPort, () => {
        console.log(`Started Server on Port ${world.config.hostPort}`);
    });

    server.on('error', (err) => {
    console.error(`Server Error: ${err.message}`);
    throw err;
    });
}

setInterval(ServerTick, 50)
function ServerTick() {
    for (var i = 0; i < world.builds.length; i++) {
        for (var j = -3; j <= 4; j++) {
            for (var k = 0; k < world.builds[i].scheduledBlockUpdates.length; k++) {
                if (world.builds[i].scheduledBlockUpdates[k].priority == j) {
                    world.builds[i].scheduledBlockUpdates[k].delay--
                    if (world.builds[i].scheduledBlockUpdates[k].delay == 0) {
                        utils.builds.SetBlockInBuild({})(world, i, world.builds[i].scheduledBlockUpdates[k].position, world.builds[i].scheduledBlockUpdates[k].blockID)
                        var updateSuccess = utils.tick_actions.set_block.AddBlockUpdate({})(world, 
                            socketIndex, 
                            world.builds[i].scheduledBlockUpdates[k].position,
                            world.builds[i].scheduledBlockUpdates[k].blockID,
                            world.builds[i].scheduledBlockUpdates[k].doubleSet,
                            world.builds[i].scheduledBlockUpdates[k].prevBlockID,
                            true
                        )
                        if (!updateSuccess) utils.builds.SetBlockInBuild({})(world, i, world.builds[i].scheduledBlockUpdates[k].position, world.builds[i].scheduledBlockUpdates[k].prevBlockID)
                    }
                }
            }
        }
        world.builds[i].scheduledBlockUpdates = world.builds[i].scheduledBlockUpdates.filter((value) => {
            return value.delay > 0
        })
    }

    for (var i = 0; i < world.loadedPlayers.length; i++) {
        if (world.loadedPlayers[i].floorChangeCooldown > 0) world.loadedPlayers[i].floorChangeCooldown--

        if (world.loadedPlayers[i].tick.spawn) {
            for (var j = 0; j < world.loadedPlayers.length; j++) {
                if (i != j) utils.tick_actions.spawn_player(world.loadedPlayers[j].socket)(world.loadedPlayers[j].socket, world.loadedPlayers[i].classicID, world.loadedPlayers[i].username, world.loadedPlayers[i].position, world.loadedPlayers[i].rotation)
                if (i != j) utils.tick_actions.message.JoinMessage(world.loadedPlayers[j].socket)(world.loadedPlayers[j].socket, world.loadedPlayers[i].username)
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
            utils.tick_actions.set_block.SetBlock(world.loadedPlayers[i].socket)(world, world.loadedPlayers[i].socket, world.blockUpdates[j], world.blockUpdates[j].id, world.blockUpdates[j].doubleSet)
        }

        for (var j = 0; j < world.disconnectedPlayers.length; j++) {
            utils.tick_actions.despawn_player(world.loadedPlayers[i].socket)(world.loadedPlayers[i].socket, world.disconnectedPlayers[j].classicID)
            utils.tick_actions.message.QuitMessage(world.loadedPlayers[i].socket)(world.loadedPlayers[i].socket, world.disconnectedPlayers[j].username)
        }

        for (var j = 0; j < world.loadedPlayers[i].tick.messages.length; j++) {
            for (var k = 0; k < world.loadedPlayers.length; k++) {
                utils.tick_actions.message.PlayerMessage(world.loadedPlayers[k].socket)(world.loadedPlayers[k].socket, world.loadedPlayers[i].username, world.loadedPlayers[i].tick.messages[j])
            }
            world.loadedPlayers[i].tick.messages = []
        }

        for (var j = 0; j < world.loadedPlayers[i].tick.systemMessages.length; j++) {
            utils.tick_actions.message.SystemMessage(world.loadedPlayers[i].socket)(world.loadedPlayers[i].socket, world.loadedPlayers[i].tick.systemMessages[j])
        }
        world.loadedPlayers[i].tick.systemMessages = []

        for (var j = 0; j < world.loadedPlayers[i].tick.errorMessages.length; j++) {
            utils.tick_actions.message.ErrorMessage(world.loadedPlayers[i].socket)(world.loadedPlayers[i].socket, world.loadedPlayers[i].tick.errorMessages[j])
        }
        world.loadedPlayers[i].tick.errorMessages = []

        if (world.loadedPlayers[i].tick.teleportSelf) {
            utils.tick_actions.teleport(world.loadedPlayers[i].socket)(world.loadedPlayers[i].socket)
            world.loadedPlayers[i].tick.teleportSelf = false
        }

        if (world.loadedPlayers[i].tick.teleportOthers) {
            for (var j = 0; j < world.loadedPlayers.length; j++) {
                utils.tick_actions.move_player_pos_rot(world.loadedPlayers[i].socket)(world.loadedPlayers[i].socket, world.loadedPlayers[j].classicID, world.loadedPlayers[j].position, world.loadedPlayers[j].rotation)
            }
        }

        if (world.closeServer) {
            world.loadedPlayers[i].socket.disconnect = "serverClosed"
            utils.disconnect(world.loadedPlayers[i].socket)(world, world.loadedPlayers[i].socket)
        }
    }
    world.blockUpdates = []
    world.disconnectedPlayers = []
    if (world.closeServer) {
        setTimeout(() => {
            process.exit(1)
        }, 1000)
        world.closeServer = false
    }
}

setInterval(ServerSave, 120000)
function ServerSave() {
    console.log("WORLD Saved")

    var savedPlayerCount = 0
    for (var i = 0; i < world.players.length; i++) {
        if (world.players[i].save) {
            savedPlayerCount++
            fs.writeFileSync(`./world/players/${world.players[i].username}.json`, JSON.stringify(world.players[i], (key, value) => {
                if (key == "classicID" || key == "inWorld" || key == "tick" || key == "save" || key == "upvn" || key == "uvni" || key == "selectedRegistries" || key == "socket") return undefined
                return value
            }))
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

setTimeout(KeepAlive, 20000)
function KeepAlive() {
    for (var i = 0; i < world.loadedPlayers.length; i++) {
        utils.tick_actions.keep_alive(world.loadedPlayers[i].socket)(world.loadedPlayers[i].socket)
    }
}

/** 
 * @param {Socket} socket 
 * @param {Buffer} data
 */
function ReadPacket(socket, data) {
    if (socket.dataBuffer.length > 0) data = Buffer.from(Array.from(socket.dataBuffer).concat(Array.from(data)))
    socket.dataBuffer = []

    socket.packetCount++

    if (!socket.identified) IdentifyVersion(socket, data)
    var packetID = GetPacketID(socket, data)

    var packetReaderFn = packetReader[packetID]

    if (packetID != null && socket.identified) {
        if (packetReaderFn != undefined) {
            var splitIndex = packetReaderFn(socket)(world, socket, data)
            if (splitIndex > 0) {
                ReadPacket(socket, data.subarray(data.length - splitIndex))
            }
            else if (splitIndex < 0) socket.dataBuffer = data
        }
        else {
            HexViewBytes(data, `unknown-packet`)
            socket.log(`SERVERBOUND --> ${packetID} "Unknown" / ${data.length} bytes`)
        }
    } else {
        socket.log("ERR: Socket Unreadable")
    }
}

/**
 * @param {Socket} socket 
 * @param {Buffer} data 
 */
function IdentifyVersion(socket, data) {
    if (socket.packetCount == 1) {
        if (data[0] == 0x00) {
            if (data.length == 65) {
                socket.log(`IDENTIFIED UPVN -1`)
                socket.log(`IDENTIFIED UVNI 29 / Classic 0.0.15a (Multiplayer Test 1)`)
                socket.identified = true
                socket.thisPlayer.upvn = -1
                socket.thisPlayer.uvni = 29

                if (world.config.minUPVN > -1) socket.setDisconnect("invalidVersion")

                return
            } else if (data.length == 130) {
                if (data[1] == 3) {
                    socket.log(`IDENTIFIED UPVN 0`)
                    socket.log(`IDENTIFIED UVNI 42 / Classic 0.0.16a_02`)
                    socket.identified = true
                    socket.thisPlayer.upvn = 0
                    socket.thisPlayer.uvni = 42

                    if (world.config.minUPVN > 0) socket.setDisconnect("invalidVersion")

                    return
                } else if (data[1] == 4) {
                    socket.log(`IDENTIFIED UPVN 1`)
                    socket.log(`IDENTIFIED UVNI 43 / Classic 0.0.17a`)
                    socket.log(`WARNING: Version could be UVNI 46 / Classic 0.0.18a_02`)
                    socket.identified = true
                    socket.thisPlayer.upvn = 1
                    socket.thisPlayer.uvni = 43

                    if (world.config.minUPVN > 1) socket.setDisconnect("invalidVersion")

                    return
                } else if (data[1] == 5) {
                    socket.log(`IDENTIFIED UPVN 2`)
                    socket.log(`IDENTIFIED UVNI 51 / Classic 0.0.19a_04`)
                    socket.log(`WARNING: Version could be UVNI 53 / Classic 0.0.19a_06`)
                    socket.identified = true
                    socket.thisPlayer.upvn = 2
                    socket.thisPlayer.uvni = 51

                    if (world.config.minUPVN > 2) socket.setDisconnect("invalidVersion")

                    return
                }
            } else if (data.length == 131) {
                if (data[1] == 6) {
                    socket.log(`IDENTIFIED UPVN 3`)
                    socket.log(`IDENTIFIED UVNI 55 / Classic 0.0.20a_01`)
                    socket.log(`WARNING: Version could be UVNI 56 / Classic 0.0.20a_02`)
                    socket.log(`WARNING: Version could be UVNI 57 / Classic 0.0.21a`)
                    socket.log(`WARNING: Version could be UVNI 64 / Classic 0.0.22a_05`)
                    socket.log(`WARNING: Version could be UVNI 66 / Classic 0.0.23a_01`)
                    socket.identified = true
                    socket.thisPlayer.upvn = 3
                    socket.thisPlayer.uvni = 55

                    if (world.config.minUPVN > 3) socket.setDisconnect("invalidVersion")

                    return
                } else if (data[1] == 7) {
                    socket.log(`IDENTIFIED UPVN 4`)
                    socket.log(`IDENTIFIED UVNI 79 / Classic 0.28_01`)
                    socket.log(`WARNING: Version could be UVNI 80 / Classic 0.29`)
                    socket.log(`WARNING: Version could be UVNI 81 / Classic 0.29_01`)
                    socket.log(`WARNING: Version could be UVNI 82 / Classic 0.29_02`)
                    socket.log(`WARNING: Version could be UVNI 83 / Classic 0.30`)
                    socket.identified = true
                    socket.thisPlayer.upvn = 4
                    socket.thisPlayer.uvni = 79

                    if (world.config.minUPVN > 4) socket.setDisconnect("invalidVersion")

                    return
                }
            }
        } else if (data[0] == 1) {
            socket.log(`IDENTIFIED UPVN 8`)
            socket.log(`IDENTIFIED UVNI 213 / Alpha v1.0.15`)
            socket.identified = true
            socket.thisPlayer.upvn = 8
            socket.thisPlayer.uvni = 213

            if (world.config.minUPVN > 8) socket.setDisconnect("invalidVersion")

            return
        } else if (data[0] == 2) {
            socket.log(`IDENTIFIED UPVN 9`)
            socket.log(`IDENTIFIED UVNI 214 / Alpha v1.0.16`)
            socket.identified = true
            socket.thisPlayer.upvn = 9
            socket.thisPlayer.uvni = 214

            if (world.config.minUPVN > 9) socket.setDisconnect("invalidVersion")

            return
        }
    }

    socket.log("ERR: Failed to Identify Socket")
}

/**
 * @param {Socket} socket 
 */
function GetPacketID(socket, data) {
    if (socket.identified) {
        if (socket.thisPlayer.upvn >= -1 && socket.thisPlayer.upvn <= 15) return data[0]
        else {
            socket.log(`ERR: Cannot Parse Packet ID for Version ${socket.thisPlayer.upvn}:${socket.thisPlayer.uvni}`)
            return null
        }
    }
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