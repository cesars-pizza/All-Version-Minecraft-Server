module.exports = {
    world_packets: require('./world_packets/distributer.cjs').GenerateBlocks,
    player: require('./player.cjs'),
    disconnect: require('./disconnect/distributer.cjs').Disconnect
}