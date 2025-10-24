const {Socket} = require('../../../data_structures.cjs')

/** 
 * @param {Socket} socket 
 */
function SetBlock(socket) {
    if (socket.thisPlayer.upvn >= -1 && socket.thisPlayer.upvn <= 4) return require('./29.cjs').SetBlock
    if (socket.thisPlayer.upvn >= 8 && socket.thisPlayer.upvn <= 15) return require('./213.cjs').SetBlock
    else {
        socket.log(`ERR: Cannot Run Set Block for Version ${socket.thisPlayer.upvn}:${socket.thisPlayer.uvni}`)
        return () => {}
    }
}

/** 
 * @param {Socket} socket 
 */
function AddBlockUpdate(socket) {
    return require('./29.cjs').AddBlockUpdate
}

function SendPostPlacementUpdate(socket) {
    return require('./29.cjs').SendPostPlacementUpdate
}

function SendNeighborChangedUpdate(socket) {
    return require('./29.cjs').SendNeighborChangedUpdate
}

function ScheduleBlockUpdate(socket) {
    return require('./29.cjs').ScheduleBlockUpdate
}

/** 
 * @param {Socket} socket 
 */
function GetBlockUpdate(socket) {
    return require('./29.cjs').GetBlockUpdate
}

function AddFloorUpdate(socket) {
    return require('./29.cjs').AddFloorUpdate
}

module.exports = {SetBlock, AddBlockUpdate, SendPostPlacementUpdate, SendNeighborChangedUpdate, ScheduleBlockUpdate, GetBlockUpdate, AddFloorUpdate}