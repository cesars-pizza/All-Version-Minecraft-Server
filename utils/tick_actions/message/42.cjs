const {Socket} = require('../../../data_structures.cjs')
const dataWriter = require('../../../data_handlers/data_writer.cjs')
const packetWriter = require('../../../data_handlers/clientbound_packets/packet_writer.cjs')

/** 
 * @param {Socket} socket 
 */
function PlayerMessage(socket, username, message) {
    if (!message.endsWith('&')) packetWriter.Message(socket)(socket, 0, `<${username}> ${message}`)
}

/** 
 * @param {Socket} socket 
 */
function JoinMessage(socket, username) {
    packetWriter.Message(socket)(socket, -1, `${username} joined the game.`)
}

/** 
 * @param {Socket} socket 
 */
function QuitMessage(socket, username) {
    packetWriter.Message(socket)(socket, -1, `${username} left the game.`)
}

/** 
 * @param {Socket} socket 
 */
function SystemMessage(socket, message) {
    packetWriter.Message(socket)(socket, 0, `[System] ${message}`)
}

module.exports = {PlayerMessage, JoinMessage, QuitMessage, SystemMessage}