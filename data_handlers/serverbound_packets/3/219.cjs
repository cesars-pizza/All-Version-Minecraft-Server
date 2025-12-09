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

                            utils.player.set.Position(world, socket.thisPlayer, newPosition)
                            
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

                                utils.player.set.Position(world, socket.thisPlayer, newPosition)
                                
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
                        else if (commandParts[1] == "plot.blockUpdate" || commandParts[1] == "plot.redstoneUpdate" || commandParts[1] == "plot.liquidUpdate" || commandParts[1] == "plot.publicInteractions" || commandParts[1] == "plot.time") {
                            if (utils.math.NegMod(socket.thisPlayer.position.x, 32) >= 16 && utils.math.NegMod(socket.thisPlayer.position.z, 32) >= 16) {
                                var plot = {x: Math.floor(socket.thisPlayer.position.x / 32), z: Math.floor(socket.thisPlayer.position.z / 32)}
                                var plotID = utils.builds.GetBuild(socket)(world, plot.x, plot.z)
                                if (plotID == undefined || world.builds[plotID].creator != socket.thisPlayer.username) socket.thisPlayer.tick.errorMessages.push(`You do not own this plot`)
                                else {
                                    if (commandParts[1] == "plot.blockUpdate") socket.thisPlayer.tick.systemMessages.push(`Block Update for Plot (${plot.x}, ${plot.z}) is currently set to ${world.builds[plotID].settings.blockUpdates ? "enabled" : "disabled"}`)
                                    else if (commandParts[1] == "plot.redstoneUpdate") socket.thisPlayer.tick.systemMessages.push(`Redstone Update for Plot (${plot.x}, ${plot.z}) is currently set to ${world.builds[plotID].settings.redstoneUpdates ? "enabled" : "disabled"}`)
                                    else if (commandParts[1] == "plot.liquidUpdate") socket.thisPlayer.tick.systemMessages.push(`Liquid Update for Plot (${plot.x}, ${plot.z}) is currently set to ${world.builds[plotID].settings.liquidUpdates ? "enabled" : "disabled"}`)
                                    else if (commandParts[1] == "plot.publicInteractions") socket.thisPlayer.tick.systemMessages.push(`Public Interactions for Plot (${plot.x}, ${plot.z}) is currently set to ${world.builds[plotID].settings.publicInteractions ? "enabled" : "disabled"}`)
                                    else if (commandParts[1] == "plot.time") socket.thisPlayer.tick.systemMessages.push(`Time for Plot (${plot.x}, ${plot.z}) is currently set to ${world.builds[plotID].settings.time}`)
                                }
                            } else socket.thisPlayer.tick.errorMessages.push(`You are not currently in a plot`)
                        }
                        else socket.thisPlayer.tick.errorMessages.push(`Unknown setting: "${commandParts[1]}"`)
                    } else {
                        if (commandParts[1] == "plotInfo") {
                            if (commandParts[2] == "enable") {
                                socket.thisPlayer.settings.showPlotInfo = true
                                socket.thisPlayer.save = true
                                socket.thisPlayer.tick.systemMessages.push("Set Plot Info to enabled")
                            } else if (commandParts[2] == "disable") {
                                socket.thisPlayer.settings.showPlotInfo = false
                                socket.thisPlayer.save = true
                                socket.thisPlayer.tick.systemMessages.push("Set Plot Info to disabled")
                            } else socket.thisPlayer.tick.errorMessages.push('Plot Info must be set to either "enable" or "disable"')
                        } else if (commandParts[1] == "plot.blockUpdate") {
                            if (commandParts[2] == "enable" || commandParts[2] == "disable") {
                                if (utils.math.NegMod(socket.thisPlayer.position.x, 32) >= 16 && utils.math.NegMod(socket.thisPlayer.position.z, 32) >= 16) {
                                    var plot = {x: Math.floor(socket.thisPlayer.position.x / 32), z: Math.floor(socket.thisPlayer.position.z / 32)}
                                    var plotID = utils.builds.GetBuild(socket)(world, plot.x, plot.z)
                                    if (plotID == undefined || world.builds[plotID].creator != socket.thisPlayer.username) socket.thisPlayer.tick.errorMessages.push(`You do not own this plot`)
                                    else {
                                        world.builds[plotID].settings.blockUpdates = commandParts[2] == "enable"
                                        world.builds[plotID].save = true
                                        socket.thisPlayer.tick.systemMessages.push(`Set Block Update for Plot (${plot.x}, ${plot.z}) to ${commandParts[2]}d`)
                                    }
                                } else socket.thisPlayer.tick.errorMessages.push(`You are not currently in a plot`)
                            } else if (commandParts[2] == "enableDefault") {
                                socket.thisPlayer.settings.defaultBuildSettings.blockUpdates = true
                                socket.thisPlayer.save = true
                                socket.thisPlayer.tick.systemMessages.push("Set Block Update to enabled for all new plots")
                            } else if (commandParts[2] == "disableDefault") {
                                socket.thisPlayer.settings.defaultBuildSettings.blockUpdates = false
                                socket.thisPlayer.save = true
                                socket.thisPlayer.tick.systemMessages.push("Set Block Update to disabled for all new plots")
                            } else if (commandParts[2] == "default") {
                                socket.thisPlayer.tick.systemMessages.push(`Block Update is currently defaulted to ${socket.thisPlayer.settings.defaultBuildSettings.blockUpdates ? "enabled" : "disabled"}`)
                            } else socket.thisPlayer.tick.systemMessages.push('Block Update must be set to one of "enable", "disable", "enableDefault", or "disableDefault"')
                        } else if (commandParts[1] == "plot.redstoneUpdate") {
                            if (commandParts[2] == "enable" || commandParts[2] == "disable") {
                                if (utils.math.NegMod(socket.thisPlayer.position.x, 32) >= 16 && utils.math.NegMod(socket.thisPlayer.position.z, 32) >= 16) {
                                    var plot = {x: Math.floor(socket.thisPlayer.position.x / 32), z: Math.floor(socket.thisPlayer.position.z / 32)}
                                    var plotID = utils.builds.GetBuild(socket)(world, plot.x, plot.z)
                                    if (plotID == undefined || world.builds[plotID].creator != socket.thisPlayer.username) socket.thisPlayer.tick.errorMessages.push(`You do not own this plot`)
                                    else {
                                        world.builds[plotID].settings.redstoneUpdates = commandParts[2] == "enable"
                                        world.builds[plotID].save = true
                                        socket.thisPlayer.tick.systemMessages.push(`Set Redstone Update for Plot (${plot.x}, ${plot.z}) to ${commandParts[2]}d`)
                                    }
                                } else socket.thisPlayer.tick.errorMessages.push(`You are not currently in a plot`)
                            } else if (commandParts[2] == "enableDefault") {
                                socket.thisPlayer.settings.defaultBuildSettings.redstoneUpdates = true
                                socket.thisPlayer.save = true
                                socket.thisPlayer.tick.systemMessages.push("Set Redstone Update to enabled for all new plots")
                            } else if (commandParts[2] == "disableDefault") {
                                socket.thisPlayer.settings.defaultBuildSettings.redstoneUpdates = false
                                socket.thisPlayer.save = true
                                socket.thisPlayer.tick.systemMessages.push("Set Redstone Update to disabled for all new plots")
                            } else if (commandParts[2] == "default") {
                                socket.thisPlayer.tick.systemMessages.push(`Redstone Update is currently defaulted to ${socket.thisPlayer.settings.defaultBuildSettings.redstoneUpdates ? "enabled" : "disabled"}`)
                            } else socket.thisPlayer.tick.systemMessages.push('Redstone Update must be set to one of "enable", "disable", "enableDefault", or "disableDefault"')
                        } else if (commandParts[1] == "plot.liquidUpdate") {
                            if (commandParts[2] == "enable" || commandParts[2] == "disable") {
                                if (utils.math.NegMod(socket.thisPlayer.position.x, 32) >= 16 && utils.math.NegMod(socket.thisPlayer.position.z, 32) >= 16) {
                                    var plot = {x: Math.floor(socket.thisPlayer.position.x / 32), z: Math.floor(socket.thisPlayer.position.z / 32)}
                                    var plotID = utils.builds.GetBuild(socket)(world, plot.x, plot.z)
                                    if (plotID == undefined || world.builds[plotID].creator != socket.thisPlayer.username) socket.thisPlayer.tick.errorMessages.push(`You do not own this plot`)
                                    else {
                                        world.builds[plotID].settings.liquidUpdates = commandParts[2] == "enable"
                                        world.builds[plotID].save = true
                                        socket.thisPlayer.tick.systemMessages.push(`Set Liquid Update for Plot (${plot.x}, ${plot.z}) to ${commandParts[2]}d`)
                                    }
                                } else socket.thisPlayer.tick.errorMessages.push(`You are not currently in a plot`)
                            } else if (commandParts[2] == "enableDefault") {
                                socket.thisPlayer.settings.defaultBuildSettings.liquidUpdates = true
                                socket.thisPlayer.save = true
                                socket.thisPlayer.tick.systemMessages.push("Set Liquid Update to enabled for all new plots")
                            } else if (commandParts[2] == "disableDefault") {
                                socket.thisPlayer.settings.defaultBuildSettings.liquidUpdates = false
                                socket.thisPlayer.save = true
                                socket.thisPlayer.tick.systemMessages.push("Set Liquid Update to disabled for all new plots")
                            } else if (commandParts[2] == "default") {
                                socket.thisPlayer.tick.systemMessages.push(`Liquid Update is currently defaulted to ${socket.thisPlayer.settings.defaultBuildSettings.liquidUpdates ? "enabled" : "disabled"}`)
                            } else socket.thisPlayer.tick.systemMessages.push('Liquid Update must be set to one of "enable", "disable", "enableDefault", or "disableDefault"')
                        } else if (commandParts[1] == "plot.publicInteractions") {
                            if (commandParts[2] == "enable" || commandParts[2] == "disable") {
                                if (utils.math.NegMod(socket.thisPlayer.position.x, 32) >= 16 && utils.math.NegMod(socket.thisPlayer.position.z, 32) >= 16) {
                                    var plot = {x: Math.floor(socket.thisPlayer.position.x / 32), z: Math.floor(socket.thisPlayer.position.z / 32)}
                                    var plotID = utils.builds.GetBuild(socket)(world, plot.x, plot.z)
                                    if (plotID == undefined || world.builds[plotID].creator != socket.thisPlayer.username) socket.thisPlayer.tick.errorMessages.push(`You do not own this plot`)
                                    else {
                                        world.builds[plotID].settings.publicInteractions = commandParts[2] == "enable"
                                        world.builds[plotID].save = true
                                        socket.thisPlayer.tick.systemMessages.push(`Set Public Interactions for Plot (${plot.x}, ${plot.z}) to ${commandParts[2]}d`)
                                    }
                                } else socket.thisPlayer.tick.errorMessages.push(`You are not currently in a plot`)
                            } else if (commandParts[2] == "enableDefault") {
                                socket.thisPlayer.settings.defaultBuildSettings.publicInteractions = true
                                socket.thisPlayer.save = true
                                socket.thisPlayer.tick.systemMessages.push("Set Public Interactions to enabled for all new plots")
                            } else if (commandParts[2] == "disableDefault") {
                                socket.thisPlayer.settings.defaultBuildSettings.publicInteractions = false
                                socket.thisPlayer.save = true
                                socket.thisPlayer.tick.systemMessages.push("Set Public Interactions to disabled for all new plots")
                            } else if (commandParts[2] == "default") {
                                socket.thisPlayer.tick.systemMessages.push(`Public Interactions is currently defaulted to ${socket.thisPlayer.settings.defaultBuildSettings.publicInteractions ? "enabled" : "disabled"}`)
                            } else socket.thisPlayer.tick.systemMessages.push('Public Interactions must be set to one of "enable", "disable", "enableDefault", or "disableDefault"')
                        }  else if (commandParts[1] == "plot.time") {
                            var timeValue = 0.1
                            if (utils.math.NegMod(socket.thisPlayer.position.x, 32) >= 16 && utils.math.NegMod(socket.thisPlayer.position.z, 32) >= 16) {
                                var plot = {x: Math.floor(socket.thisPlayer.position.x / 32), z: Math.floor(socket.thisPlayer.position.z / 32)}
                                var plotID = utils.builds.GetBuild(socket)(world, plot.x, plot.z)
                                if (plotID == undefined || world.builds[plotID].creator != socket.thisPlayer.username) socket.thisPlayer.tick.errorMessages.push(`You do not own this plot`)
                                else {
                                    if (commandParts[2] == "day") timeValue = 1000
                                    else if (commandParts[2] == "noon") timeValue = 6000
                                    else if (commandParts[2] == "night") timeValue = 13000
                                    else if (commandParts[2] == "midnight") timeValue = 18000
                                    else {
                                        var customTime = 0
                                        var success = false
                                        try {
                                            customTime = BigInt(commandParts[2])
                                            success = true
                                        } catch { }
                                        if (customTime < 9223372036854775808n && customTime >= -9223372036854775808n && success) timeValue = customTime
                                        else if (success) socket.thisPlayer.tick.errorMessages.push('Value out of range, must be of type Long')
                                        else socket.thisPlayer.tick.errorMessages.push('Invalid time value, must be of type Long')
                                    }
                                }
                            } else socket.thisPlayer.tick.errorMessages.push(`You are not currently in a plot`)
                            
                            if (timeValue != 0.1) {
                                world.builds[plotID].settings.time = timeValue
                                for (var i = 0; i < world.loadedPlayers.length; i++) {
                                    if (utils.math.NegMod(world.loadedPlayers[i].position.x, 32) >= 16 && utils.math.NegMod(world.loadedPlayers[i].position.z, 32) >= 16) {
                                        var compPlot = {x: Math.floor(world.loadedPlayers[i].position.x / 32), z: Math.floor(world.loadedPlayers[i].position.z / 32)}
                                        if (compPlot.x == plot.x && compPlot.z == plot.z) {
                                            world.loadedPlayers[i].currentTime = timeValue
                                        }
                                    }
                                }
                                socket.thisPlayer.tick.systemMessages.push(`Set Time for Plot (${plot.x}, ${plot.z}) to ${timeValue}`)
                            }
                        } else socket.thisPlayer.tick.errorMessages.push(`Unknown setting: "${commandParts[1]}"`)
                    }
                } else if (commandParts[0] == "/swapInv") {
                    socket.thisPlayer.tick.errorMessages.push(`This command is not available in this version`)
                } else socket.thisPlayer.tick.errorMessages.push(`Unknown command: "${message.value.split(' ')[0]}"`)
            } else socket.thisPlayer.tick.messages.push(message.value)
        }

        return data.length - (1 + message.length)
    }
}

module.exports = {ReadPacket}