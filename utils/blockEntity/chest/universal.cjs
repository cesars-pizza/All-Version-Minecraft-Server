const {Socket, Position} = require('../../../data_structures.cjs')

/** 
 * @param {Socket} socket 
 * @param {string} id 
 * @param {Position} position 
 * @param {undefined} data 
 */
function GenerateNew(world, socket, id, position) {
    return {
        id: "chest",
        position: position,
        customName: undefined,
        Items: [],
        lock: undefined,
        gold: false
    }
}

module.exports = {GenerateNew}