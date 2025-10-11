module.exports = {
    Server_Identification: require('./Server Identification/distributer.cjs').WritePacket,
    Level_Initilize: require('./Level Initilize/distributer.cjs').WritePacket,
    Level_Data_Chunk: require('./Level Data Chunk/distributer.cjs').WritePacket,
    Level_Finalize: require('./Level Finalize/distributer.cjs').WritePacket,
    Set_Block: require('./Set Block/distributer.cjs').WritePacket,
    Spawn_Player: require('./Spawn Player/distributer.cjs').WritePacket,
    Set_Position_and_Orientation: require('./Set Position and Orientation/distributer.cjs').WritePacket,
    Despawn_Player: require('./Despawn Player/distributer.cjs').WritePacket,
    Message: require('./Message/distributer.cjs').WritePacket,
    Disconnect_Player: require('./Disconnect Player/distributer.cjs').WritePacket,

    Keep_Alive: require('./Keep Alive/distributer.cjs').WritePacket,
    Login_Response: require('./Login Response/distributer.cjs').WritePacket,
    Chat_Message: require('./Chat Message/distributer.cjs').WritePacket,
    Player_Position_And_Look: require('./Player Position And Look/distributer.cjs').WritePacket,
    Add_To_Inventory: require('./Add To Inventory/distributer.cjs').WritePacket,
    Pre_Chunk: require('./Pre Chunk/distributer.cjs').WritePacket,
    Map_Chunk: require('./Map Chunk/distributer.cjs').WritePacket,
    Block_Change: require('./Block Change/distributer.cjs').WritePacket,
    Multi_Block_Change: require('./Multi Block Change/distributer.cjs').WritePacket,
    Kick: require('./Kick/distributer.cjs').WritePacket,

    _alt: {
        Level_Data_Chunk_alt0: require('./Level Data Chunk/distributer.cjs').WritePacket_Alt0,

        Map_Chunk_alt0: require('./Map Chunk/distributer.cjs').WritePacket_Alt0
    }
}