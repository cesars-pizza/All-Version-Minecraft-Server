const {Socket} = require('../../../data_structures.cjs')

/** 
 * @param {Socket} socket 
 * @param {string} id 
 * @param {Position} position 
 * @param {Array} data 
 */
function ConvertToUniversalData(world, socket, id, position, data) {
    if (socket.upvn >= 11 && socket.upvn <= 15) return require('./222.cjs').ConvertToUniversalData(world, socket, id, position, data)
    else {
        socket.log(`ERR: Cannot Convert Furnace To Universal Block Entity Data for Version ${socket.upvn}:${socket.uvni}`)
        return {}
    }
}

/** 
 * @param {Socket} socket 
 * @param {string} id 
 * @param {Position} position 
 * @param {Array} data 
 */
function ConvertToVersionSpecificData(world, socket, data) {
    if (socket.upvn >= 11 && socket.upvn <= 15) return require('./222.cjs').ConvertToUniversalData(world, socket, data)
    else {
        socket.log(`ERR: Cannot Convert Furnace To Version Specific Block Entity Data for Version ${socket.upvn}:${socket.uvni}`)
        return {}
    }
}

/** 
 * @param {Socket} socket 
 * @param {string} id 
 * @param {Position} position 
 */
function GenerateNew(world, socket, id, position) {
    return require('./universal.cjs').GenerateNew(world, socket, id, position)
}

module.exports = {ConvertToUniversalData, ConvertToVersionSpecificData, GenerateNew}