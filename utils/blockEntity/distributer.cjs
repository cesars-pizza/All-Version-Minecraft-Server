const {Socket} = require('../../../data_structures.cjs')

/** 
 * @param {Socket} socket 
 * @param {string} id 
 * @param {Position} position 
 * @param {Array} data 
 */
function ConvertToUniversalData(world, socket, id, position, data) {
    if (id == "chest") return require('./chest/distributer.cjs').ConvertToUniversalData(world, socket, id, position, data)
    if (id == "furnace") return require('./furnace/distributer.cjs').ConvertToUniversalData(world, socket, id, position, data)
    if (id == "oak_sign") return require('./sign/distributer.cjs').ConvertToUniversalData(world, socket, id, position, data)
    else {
        socket.log(`ERR: Cannot Convert To Universal Block Entity Data for Block ${id}`)
        return () => {}
    }
}

module.exports = {ConvertToUniversalData}