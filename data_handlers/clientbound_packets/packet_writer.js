module.exports = {
    Server_Identification: require('./Server Identification/distributer.js').WritePacket,
    Level_Initilize: require('./Level Initilize/distributer.js').WritePacket,
    Level_Data_Chunk: require('./Level Data Chunk/distributer.js').WritePacket,
    Level_Finalize: require('./Level Finalize/distributer.js').WritePacket,
    Spawn_Player: require('./Spawn Player/distributer.js').WritePacket,
    _alt: {
        Level_Data_Chunk_alt0: require('./Level Data Chunk/distributer.js').WritePacket_Alt0
    }
}