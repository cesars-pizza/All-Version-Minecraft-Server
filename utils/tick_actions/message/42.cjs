const {Socket} = require('../../../data_structures.cjs')
const dataWriter = require('../../../data_handlers/data_writer.cjs')
const packetWriter = require('../../../data_handlers/clientbound_packets/packet_writer.cjs')

/** 
 * @param {Socket} socket 
 */
function Message(socket, username, message) {
    if (!message.endsWith('&')) packetWriter.Message(socket)(socket, 0, `<${username}> ${message}`)
}

module.exports = {Message}