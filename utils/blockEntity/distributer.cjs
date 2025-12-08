const {Socket} = require('../../data_structures.cjs')
const utils = require('../utils.cjs')

/** 
 * @param {Socket} socket 
 * @param {string} id 
 * @param {Array} data 
 */
function ConvertToUniversalData(world, socket, id, position, data) {
    if (id == "chest") return require('./chest/distributer.cjs').ConvertToUniversalData(world, socket, id, data)
    else if (id == "furnace") return require('./furnace/distributer.cjs').ConvertToUniversalData(world, socket, id, data)
    else if (id == "oak_sign") return require('./sign/distributer.cjs').ConvertToUniversalData(world, socket, id, data)
    else if (id == "spawner") return require('./spawner/distributer.cjs').ConvertToUniversalData(world, socket, id, data)
    else if (id == "jukebox") return require('./spawner/distributer.cjs').ConvertToUniversalData(world, socket, id, data)
    else {
        socket.log(`ERR: Cannot Convert To Universal Block Entity Data for Block ${id}`)
        return {}
    }
}

/** 
 * @param {Socket} socket 
 * @param {Array} data 
 */
function ConvertToVersionSpecificData(world, socket, data) {
    var id = data.id
    if (id == "chest") return require('./chest/distributer.cjs').ConvertToVersionSpecificData(world, socket, data)
    else if (id == "furnace") return require('./furnace/distributer.cjs').ConvertToVersionSpecificData(world, socket, data)
    else if (id == "oak_sign") return require('./sign/distributer.cjs').ConvertToVersionSpecificData(world, socket, data)
    else if (id == "spawner") return require('./spawner/distributer.cjs').ConvertToVersionSpecificData(world, socket, data)
    else if (id == "jukebox") return require('./spawner/distributer.cjs').ConvertToVersionSpecificData(world, socket, data)
    else {
        socket.log(`ERR: Cannot Convert To Version Specific Block Entity Data for Block ${id}`)
        return {}
    }
}

/** 
 * @param {Socket} socket 
 * @param {string} id 
 * @param {Position} position 
 */
function GenerateNew(world, socket, id, position) {
    if (id == "chest") return require('./chest/distributer.cjs').GenerateNew(world, socket, id, position)
    else if (id == "furnace") return require('./furnace/distributer.cjs').GenerateNew(world, socket, id, position)
    else if (id == "oak_sign") return require('./sign/distributer.cjs').GenerateNew(world, socket, id, position)
    else if (id == "spawner") return require('./spawner/distributer.cjs').GenerateNew(world, socket, id, position)
    else if (id == "jukebox") return require('./spawner/distributer.cjs').GenerateNew(world, socket, id, position)
    else {
        socket.log(`ERR: Cannot Generate New Block Entity Data for Block ${id}`, false)
        return {}
    }
}

function IsBlockEntity(id) {
    var validIDs = ["chest", "furnace", "oak_sign", "spawner", "jukebox"]
    var validTags = []

    if (validIDs.includes(id)) return true
    return false
}

module.exports = {ConvertToUniversalData, ConvertToVersionSpecificData, GenerateNew, IsBlockEntity}