module.exports = {
    Server_Identification: require('./Server Identification/distributer.cjs').WritePacket,
    Level_Initilize: require('./Level Initilize/distributer.cjs').WritePacket,
    Level_Data_Chunk: require('./Level Data Chunk/distributer.cjs').WritePacket,
    Level_Finalize: require('./Level Finalize/distributer.cjs').WritePacket,
    Set_Block: require('./Set Block/distributer.cjs').WritePacket,
    Spawn_Player: require('./Spawn Player/distributer.cjs').WritePacket,
    Set_Position_and_Orientation: require('./Set Position and Orientation/distributer.cjs').WritePacket,
    Despawn_Player: require('./Despawn Player/distributer.cjs').WritePacket,
    _alt: {
        Level_Data_Chunk_alt0: require('./Level Data Chunk/distributer.cjs').WritePacket_Alt0
    }
}