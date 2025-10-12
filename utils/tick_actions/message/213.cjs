const {Socket} = require('../../../data_structures.cjs')
const dataWriter = require('../../../data_handlers/data_writer.cjs')
const packetWriter = require('../../../data_handlers/clientbound_packets/packet_writer.cjs')

/** 
 * @param {Socket} socket 
 */
function PlayerMessage(socket, username, message) {
    packetWriter.Chat_Message(socket)(undefined, socket, `<${username}> ${message}`)
}

/** 
 * @param {Socket} socket 
 */
function JoinMessage(socket, username) {
    packetWriter.Chat_Message(socket)(undefined, socket, `§e${username} joined the game.`)
}

/** 
 * @param {Socket} socket 
 */
function QuitMessage(socket, username) {
    packetWriter.Chat_Message(socket)(undefined, socket, `§e${username} left the game.`)
}

/** 
 * @param {Socket} socket 
 */
function SystemMessage(socket, message) {
    packetWriter.Chat_Message(socket)(undefined, socket, `§d[System] ${message}`)
}

/** 
 * @param {Socket} socket 
 */
function ErrorMessage(socket, message) {
    packetWriter.Chat_Message(socket)(undefined, socket, `§c${message}`)
}

module.exports = {PlayerMessage, JoinMessage, QuitMessage, SystemMessage, ErrorMessage}