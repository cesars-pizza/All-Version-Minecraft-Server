const {Socket, World} = require('../../data_structures.cjs')
const dataWriter = require('../../data_handlers/data_writer.cjs')
const packetWriter = require('../../data_handlers/clientbound_packets/packet_writer.cjs')
const utils = require('../utils.cjs')

/**
 * @param {World} world 
 * @param {Socket} socket 
 */
function Disconnect(world, socket) {
    world.loadingPlayerNames.splice(world.loadingPlayerNames.indexOf(""))

    var errText = ""
    if (socket.disconnect == "maxPlayers") errText = `This Server Is Full. (${world.maxPlayerCount} / ${world.maxPlayerCount})`
    else if (socket.disconnect == "invalidVersion") errText = `This Server Has Blocked This Version.`
    else if (socket.disconnect == "multipleInstances") errText = `Player With The Name ${socket.thisPlayer.username} Is Already Connected.`
    else if (socket.disconnect == "unverified") errText = `This Account Has Been Previously Verified.`
    else if (socket.disconnect == "serverClosed") errText = `Server Closed.`
    else errText = `ERR: ${socket.disconnect}`

    packetWriter.Classic.Server_Identification(socket)(world, socket, "Connection lost", errText)

    packetWriter.Classic.Level_Initilize(socket)(socket)
}

module.exports = {Disconnect}