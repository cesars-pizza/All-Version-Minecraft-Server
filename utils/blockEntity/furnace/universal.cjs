const {Socket, Position} = require('../../../data_structures.cjs')

/** 
 * @param {Socket} socket 
 * @param {string} id 
 * @param {Position} position 
 * @param {undefined} data 
 */
function GenerateNew(world, socket, id, position) {
    return {
        id: "furnace",
        position: position,
        customName: undefined,
        Items: [],
        lock: undefined,
        litTime: {
            remaining: 0,
            total: 0
        },
        cookingTime: {
            remaining: 0,
            total: 0
        }
    }
}

module.exports = {GenerateNew}