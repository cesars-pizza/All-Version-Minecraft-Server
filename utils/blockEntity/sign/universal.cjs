const {Socket, Position} = require('../../../data_structures.cjs')

/** 
 * @param {Socket} socket 
 * @param {string} id 
 * @param {Position} position 
 * @param {undefined} data 
 */
function GenerateNew(world, socket, id, position) {
    return {
        id: "oak_sign",
        position: position,
        isWaxed: false,
        frontText: {
            isGlowing: false,
            color: "black",
            messages: [
                "",
                "",
                "",
                ""
            ]
        },
        backText: {
            isGlowing: false,
            color: "black",
            messages: [
                "",
                "",
                "",
                ""
            ]
        }
    }
}

module.exports = {GenerateNew}