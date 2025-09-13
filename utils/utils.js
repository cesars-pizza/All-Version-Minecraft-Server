module.exports = {
    world_packets: require('./world_packets/distributer').GenerateBlocks,
    player: require('./player'),
    disconnect: require('./disconnect/distributer').Disconnect
}