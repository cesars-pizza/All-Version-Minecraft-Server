const {Socket, World} = require('../../../data_structures.cjs')
const dataReader = require('../../data_reader.cjs')
const packetWriter = require('../../clientbound_packets/packet_writer.cjs')
const utils = require('../../../utils/utils.cjs')

var packetID = 3
var packetIdentifier = "Chat Message"

/** 
 * @param {World} world 
 * @param {Socket} socket 
 * @param {Buffer} data 
 */
function ReadPacket(world, socket, data) {
    var message = dataReader.readString(socket, data, 1)
    
    socket.log(`SERVERBOUND --> ${packetID} "${packetIdentifier}" / ${data.length} bytes`, false)
    
    if (message.value == undefined) return -999
    else {
        if (socket.disconnect == "") {
            if (message.value[0] == "/") {
                var commandParts = message.value.split(' ')

                if (commandParts[0] == "/save") {
                    world.serverFunctions.save()
                    socket.thisPlayer.tick.systemMessages.push("Saved Server")
                } else if (commandParts[0] == "/close") {
                    world.closeServer = true
                } else if (commandParts[0] == "/tp") {
                    if (commandParts.length >= 2) {
                        var playerIndex = world.loadedPlayers.map((player) => player.username).indexOf(commandParts[1])
                        if (playerIndex >= 0) {
                            var newPosition = {
                                x: Math.round(world.loadedPlayers[playerIndex].position.x - 0.5) + 0.5,
                                y: Math.round(world.loadedPlayers[playerIndex].position.y - 0.5) + 0.5,
                                z: Math.round(world.loadedPlayers[playerIndex].position.z - 0.5) + 0.5
                            }

                            utils.world_packets.GenerateRenderDistance(socket)(world, socket, 10, Math.floor(newPosition.x / 16), Math.floor(newPosition.z / 16), Math.floor(socket.thisPlayer.position.x / 16), Math.floor(socket.thisPlayer.position.z / 16))
                            
                            socket.thisPlayer.position = newPosition
                            socket.thisPlayer.tick.position = true
                            socket.thisPlayer.tick.teleportSelf = true
                            socket.thisPlayer.tick.systemMessages.push(`Teleported to ${commandParts[1]}`)
                        } else socket.thisPlayer.tick.errorMessages.push(`${commandParts[1]} is not online.`)
                    } else socket.thisPlayer.tick.errorMessages.push(`Missing argument: player`)
                } else if (commandParts[0] == "/plotTp") {
                    if (commandParts.length >= 3) {
                        var plotPos = {
                            x: Number(commandParts[1]),
                            z: Number(commandParts[2])
                        }

                        if (!Number.isInteger(plotPos.x)) socket.thisPlayer.tick.errorMessages.push(`Argument plotX needs to be an integer`)
                        else if (!Number.isInteger(plotPos.z)) socket.thisPlayer.tick.errorMessages.push(`Argument plotZ needs to be an integer`)
                        else {
                            if (plotPos.x < -32768 || plotPos.x > 32767) socket.thisPlayer.tick.errorMessages.push(`Argument plotX out of range [-32768...32767]`)
                            else if (plotPos.x < -32768 || plotPos.x > 32767) socket.thisPlayer.tick.errorMessages.push(`Argument plotZ out of range [-32768...32767]`)
                            else {
                                var newPosition = {
                                    x: plotPos.x * 32 + 15.5,
                                    y: 2,
                                    z: plotPos.z * 32 + 15.5
                                }

                                utils.world_packets.GenerateRenderDistance(socket)(world, socket, 10, Math.floor(newPosition.x / 16), Math.floor(newPosition.z / 16), Math.floor(socket.thisPlayer.position.x / 16), Math.floor(socket.thisPlayer.position.z / 16))

                                socket.thisPlayer.position = newPosition
                                socket.thisPlayer.tick.position = true
                                socket.thisPlayer.tick.teleportSelf = true
                                socket.thisPlayer.tick.systemMessages.push(`Teleported to plot ${plotPos.x}, ${plotPos.z}`)
                            }
                        }
                    } else if (commandParts.length == 2) socket.thisPlayer.tick.errorMessages.push(`Missing argument: plotZ`)
                    else socket.thisPlayer.tick.errorMessages.push(`Missing argument: plotX`)
                } else if (commandParts[0] == "/settings") {
                    if (commandParts.length == 1) socket.thisPlayer.tick.errorMessages.push("Missing argument: setting")
                    else if (commandParts.length == 2) {
                        if (commandParts[1] == "plotInfo") socket.thisPlayer.tick.systemMessages.push(`Plot Info is currently set to ${socket.thisPlayer.settings.showPlotInfo ? "enabled" : "disabled"}`)
                        else socket.thisPlayer.tick.errorMessages.push(`Unknown setting: "${commandParts[1]}"`)
                    } else {
                        if (commandParts[1] == "plotInfo") {
                            if (commandParts[2] == "enable") {
                                socket.thisPlayer.settings.showPlotInfo = true
                                socket.thisPlayer.tick.systemMessages.push("Set Plot Info to enabled")
                            } else if (commandParts[2] == "disable") {
                                socket.thisPlayer.settings.showPlotInfo = false
                                socket.thisPlayer.tick.systemMessages.push("Set Plot Info to disabled")
                            } else socket.thisPlayer.tick.errorMessages.push('Plot Info must be set to either "enable" or "disable"')
                        }
                        else socket.thisPlayer.tick.errorMessages.push(`Unknown setting: "${commandParts[1]}"`)
                    }
                } else socket.thisPlayer.tick.errorMessages.push(`Unknown command: "${message.value.split(' ')[0]}"`)
            } else socket.thisPlayer.tick.messages.push(message.value)
        }

        return data.length - (1 + message.length)
    }
}

module.exports = {ReadPacket}