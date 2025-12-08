const {Socket, Position} = require('../../../data_structures.cjs')

/** 
 * @param {Socket} socket 
 * @param {string} id 
 * @param {Position} position 
 * @param {undefined} data 
 */
function GenerateNew(world, socket, id, position) {
    return {
        id: "jukebox",
        position: position,
        recordItem: {
            id: "air",
            count: 0,
            added_components: [],
            removed_components: []
        }
    }
}

module.exports = {GenerateNew}