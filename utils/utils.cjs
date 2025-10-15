module.exports = {
    world_packets: require('./world_packets/distributer.cjs'),
    player: require('./player/distributer.cjs'),
    disconnect: require('./disconnect/distributer.cjs').Disconnect,
    math: require('./math.cjs'),
    worldgen: require('./worldgen/distributer.cjs'),
    registry: {
        block: require('./registries/block.cjs'),
        item: require('./registries/item.cjs'),
        version: require('./registries/version.cjs')
    },
    builds: require('./builds/distributer.cjs'),
    tick_actions: {
        spawn_player: require('./tick_actions/spawn_player/distributer.cjs').SpawnPlayer,
        move_player_pos: require('./tick_actions/move_player_pos/distributer.cjs').MovePlayer,
        move_player_rot: require('./tick_actions/move_player_rot/distributer.cjs').MovePlayer,
        move_player_pos_rot: require('./tick_actions/move_player_pos_rot/distributer.cjs').MovePlayer,
        set_block: require('./tick_actions/set_block/distributer.cjs'),
        despawn_player: require('./tick_actions/despawn_player/distributer.cjs').DespawnPlayer,
        message: require('./tick_actions/message/distributer.cjs'),
        teleport: require('./tick_actions/teleport/distributer.cjs').TeleportSelf
    },
    load_world: require('./load_world.cjs').loadWorld
}