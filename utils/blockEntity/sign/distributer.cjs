const {Socket} = require('../../../data_structures.cjs')

/** 
 * @param {Socket} socket 
 * @param {string} id 
 * @param {Array} data 
 */
function ConvertToUniversalData(world, socket, id, data) {
    if (socket.thisPlayer.upvn >= 11 && socket.thisPlayer.upvn <= 26) return require('./222.cjs').ConvertToUniversalData(world, socket, id, data)
    else {
        socket.log(`ERR: Cannot Convert Sign To Universal Block Entity Data for Version ${socket.thisPlayer.upvn}:${socket.thisPlayer.uvni}`)
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
    if (socket.thisPlayer.upvn >= 11 && socket.thisPlayer.upvn <= 26) return require('./222.cjs').ConvertToVersionSpecificData(world, socket, data)
    else {
        socket.log(`ERR: Cannot Convert Sign To Version Specific Block Entity Data for Version ${socket.thisPlayer.upvn}:${socket.thisPlayer.uvni}`)
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