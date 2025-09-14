module.exports = {
    world_packets: require('./world_packets/distributer.cjs').GenerateBlocks,
    player: require('./player.cjs'),
    disconnect: require('./disconnect/distributer.cjs').Disconnect,
    math: require('./math.cjs'),
    worldgen: require('./worldgen/distributer.cjs'),
    registry: {
        block: require('./registries/block.cjs')
    },
    builds: require('./builds.cjs')
}