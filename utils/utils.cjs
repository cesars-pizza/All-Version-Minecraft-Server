module.exports = {
    world_packets: require('./world_packets/distributer.cjs').GenerateBlocks,
    player: require('./player.cjs'),
    disconnect: require('./disconnect/distributer.cjs').Disconnect,
    math: require('./math.cjs'),
    worldgen: require('./worldgen/distributer.cjs'),
    registry: {
        block: require('./registries/block.cjs')
    },
    builds: require('./builds.cjs'),
    tick_actions: {
        spawn_player: require('./tick_actions/spawn_player/distributer.cjs').SpawnPlayer,
        move_player_pos: require('./tick_actions/move_player_pos/distributer.cjs').MovePlayer,
        move_player_rot: require('./tick_actions/move_player_rot/distributer.cjs').MovePlayer,
        move_player_pos_rot: require('./tick_actions/move_player_pos_rot/distributer.cjs').MovePlayer,
        set_block: undefined
    }
}