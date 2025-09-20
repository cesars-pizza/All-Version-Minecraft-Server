const {Socket} = require('../../../data_structures.cjs')

/** 
 * @param {Socket} socket 
 */
function PlayerMessage(socket) {
    if (socket.thisPlayer.upvn >= 0 && socket.thisPlayer.upvn <= 4) return require('./42.cjs').PlayerMessage
    else {
        socket.log(`ERR: Cannot Run Player Message for Version ${socket.thisPlayer.upvn}:${socket.thisPlayer.uvni}`)
        return () => {}
    }
}

/** 
 * @param {Socket} socket 
 */
function JoinMessage(socket) {
    if (socket.thisPlayer.upvn >= 0 && socket.thisPlayer.upvn <= 4) return require('./42.cjs').JoinMessage
    else {
        socket.log(`ERR: Cannot Run Join Message for Version ${socket.thisPlayer.upvn}:${socket.thisPlayer.uvni}`)
        return () => {}
    }
}

/** 
 * @param {Socket} socket 
 */
function QuitMessage(socket) {
    if (socket.thisPlayer.upvn >= 0 && socket.thisPlayer.upvn <= 4) return require('./42.cjs').QuitMessage
    else {
        socket.log(`ERR: Cannot Run Quit Message for Version ${socket.thisPlayer.upvn}:${socket.thisPlayer.uvni}`)
        return () => {}
    }
}

/** 
 * @param {Socket} socket 
 */
function SystemMessage(socket) {
    if (socket.thisPlayer.upvn >= 0 && socket.thisPlayer.upvn <= 4) return require('./42.cjs').SystemMessage
    else {
        socket.log(`ERR: Cannot Run System Message for Version ${socket.thisPlayer.upvn}:${socket.thisPlayer.uvni}`)
        return () => {}
    }
}

module.exports = {PlayerMessage, JoinMessage, QuitMessage, SystemMessage}