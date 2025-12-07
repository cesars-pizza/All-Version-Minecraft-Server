const {Socket, Position} = require('../../../data_structures.cjs')

/** 
 * @param {Socket} socket 
 * @param {string} id 
 * @param {Position} position 
 * @param {undefined} data 
 */
function GenerateNew(world, socket, id, position) {
    return {
        id: "spawner",
        position: position,
        spawnDelay: {
            min: 200,
            max: 600,
            current: 600
        },
        spawnCount: 1,
        entity: "pig"
    }
}

module.exports = {GenerateNew}