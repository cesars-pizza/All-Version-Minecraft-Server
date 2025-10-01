const {Socket} = require('../../../data_structures.cjs')
const dataWriter = require('../../../data_handlers/data_writer.cjs')
const packetWriter = require('../../../data_handlers/clientbound_packets/packet_writer.cjs')

/** 
 * @param {Socket} socket 
 */
function TeleportSelf(socket) {
    packetWriter.Player_Position_And_Look(socket)({}, socket, {x: socket.thisPlayer.position.x, y: socket.thisPlayer.position.y + 1, z: socket.thisPlayer.position.z}, socket.thisPlayer.position.y + 2.6, socket.thisPlayer.rotation, true)
}

module.exports = {TeleportSelf}