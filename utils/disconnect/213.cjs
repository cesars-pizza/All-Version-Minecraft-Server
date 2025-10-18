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

    if (socket.disconnect == "maxPlayers") {
        packetWriter.Alpha.Kick(socket)(socket, `This Server Is Full. (${world.maxPlayerCount} / ${world.maxPlayerCount})`)
    } else if (socket.disconnect == "invalidVersion") {
        packetWriter.Alpha.Kick(socket)(socket, `This Server Has Blocked This Version.`)
    } else if (socket.disconnect == "multipleInstances") {
        packetWriter.Alpha.Kick(socket)(socket, `Player With The Name ${socket.thisPlayer.username} Is Already Connected.`)
    } else if (socket.disconnect == "unverified") {
        packetWriter.Alpha.Kick(socket)(socket, `This Account Has Been Previously Verified.`)
    } else if (socket.disconnect == "serverClosed") {
        packetWriter.Alpha.Kick(socket)(socket, `Server Closed.`)
    } else {
        packetWriter.Alpha.Kick(socket)(socket, `ERR: ${socket.disconnect}`)
    }

    //socket.destroySoon()
}

module.exports = {Disconnect}