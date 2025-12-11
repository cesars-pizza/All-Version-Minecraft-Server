module.exports = {
    Classic: {
        Server_Identification: require('./Classic/Server Identification/distributer.cjs').WritePacket,
        Level_Initilize: require('./Classic/Level Initilize/distributer.cjs').WritePacket,
        Level_Data_Chunk: require('./Classic/Level Data Chunk/distributer.cjs').WritePacket,
        Level_Finalize: require('./Classic/Level Finalize/distributer.cjs').WritePacket,
        Set_Block: require('./Classic/Set Block/distributer.cjs').WritePacket,
        Spawn_Player: require('./Classic/Spawn Player/distributer.cjs').WritePacket,
        Set_Position_and_Orientation: require('./Classic/Set Position and Orientation/distributer.cjs').WritePacket,
        Despawn_Player: require('./Classic/Despawn Player/distributer.cjs').WritePacket,
        Message: require('./Classic/Message/distributer.cjs').WritePacket,
        Disconnect_Player: require('./Classic/Disconnect Player/distributer.cjs').WritePacket
    },

    Alpha: {
        Keep_Alive: require('./Alpha/Keep Alive/distributer.cjs').WritePacket,
        Login_Response: require('./Alpha/Login Response/distributer.cjs').WritePacket,
        Handshake: require('./Alpha/Handshake/distributer.cjs').WritePacket,
        Chat_Message: require('./Alpha/Chat Message/distributer.cjs').WritePacket,
        Time_Update: require('./Alpha/Time Update/distributer.cjs').WritePacket,
        Player_Inventory: require('./Alpha/Player Inventory/distributer.cjs').WritePacket,
        Player_Position_And_Look: require('./Alpha/Player Position And Look/distributer.cjs').WritePacket,
        Holding_Change: require('./Alpha/Holding Change/distributer.cjs').WritePacket,
        Add_To_Inventory: require('./Alpha/Add To Inventory/distributer.cjs').WritePacket,
        Animation: require('./Alpha/Animation/distributer.cjs').WritePacket,
        Named_Entity_Spawn: require('./Alpha/Named Entity Spawn/distributer.cjs').WritePacket,
        Destroy_Entity: require('./Alpha/Destroy Entity/distributer.cjs').WritePacket,
        Entity: require('./Alpha/Entity/distributer.cjs').WritePacket,
        Entity_Relative_Move: require('./Alpha/Entity Relative Move/distributer.cjs').WritePacket,
        Entity_Look: require('./Alpha/Entity Look/distributer.cjs').WritePacket,
        Entity_Look_and_Relative_Move: require('./Alpha/Entity Look and Relative Move/distributer.cjs').WritePacket,
        Entity_Teleport: require('./Alpha/Entity Teleport/distributer.cjs').WritePacket,
        Pre_Chunk: require('./Alpha/Pre Chunk/distributer.cjs').WritePacket,
        Map_Chunk: require('./Alpha/Map Chunk/distributer.cjs').WritePacket,
        Multi_Block_Change: require('./Alpha/Multi Block Change/distributer.cjs').WritePacket,
        Block_Change: require('./Alpha/Block Change/distributer.cjs').WritePacket,
        Complex_Entities: require('./Alpha/Complex Entities/distributer.cjs').WritePacket,
        Kick: require('./Alpha/Kick/distributer.cjs').WritePacket
    },

    _alt: {
        Classic: { Level_Data_Chunk_alt0: require('./Classic/Level Data Chunk/distributer.cjs').WritePacket_Alt0 },

        Alpha: { Map_Chunk_alt0: require('./Alpha/Map Chunk/distributer.cjs').WritePacket_Alt0 }
    }
}