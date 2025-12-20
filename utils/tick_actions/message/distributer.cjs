const {Socket} = require('../../../data_structures.cjs')

/** 
 * @param {Socket} socket 
 */
function PlayerMessage(socket) {
    if (socket.thisPlayer.upvn >= 0 && socket.thisPlayer.upvn <= 4) return require('./42.cjs').PlayerMessage
    else if (socket.thisPlayer.upvn >= 8 && socket.thisPlayer.upvn <= 15) return require('./213.cjs').PlayerMessage
    else if (socket.thisPlayer.upvn >= 16 && socket.thisPlayer.upvn <= 26) return require('./241.cjs').PlayerMessage
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
    else if (socket.thisPlayer.upvn >= 8 && socket.thisPlayer.upvn <= 15) return require('./213.cjs').JoinMessage
    else if (socket.thisPlayer.upvn >= 16 && socket.thisPlayer.upvn <= 26) return require('./241.cjs').JoinMessage
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
    else if (socket.thisPlayer.upvn >= 8 && socket.thisPlayer.upvn <= 15) return require('./213.cjs').QuitMessage
    else if (socket.thisPlayer.upvn >= 16 && socket.thisPlayer.upvn <= 26) return require('./241.cjs').QuitMessage
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
    else if (socket.thisPlayer.upvn >= 8 && socket.thisPlayer.upvn <= 15) return require('./213.cjs').SystemMessage
    else if (socket.thisPlayer.upvn >= 16 && socket.thisPlayer.upvn <= 26) return require('./241.cjs').SystemMessage
    else {
        socket.log(`ERR: Cannot Run System Message for Version ${socket.thisPlayer.upvn}:${socket.thisPlayer.uvni}`)
        return () => {}
    }
}

/** 
 * @param {Socket} socket 
 */
function ErrorMessage(socket) {
    if (socket.thisPlayer.upvn >= 0 && socket.thisPlayer.upvn <= 4) return require('./42.cjs').ErrorMessage
    else if (socket.thisPlayer.upvn >= 8 && socket.thisPlayer.upvn <= 15) return require('./213.cjs').ErrorMessage
    else if (socket.thisPlayer.upvn >= 16 && socket.thisPlayer.upvn <= 26) return require('./241.cjs').ErrorMessage
    else {
        socket.log(`ERR: Cannot Run Error Message for Version ${socket.thisPlayer.upvn}:${socket.thisPlayer.uvni}`)
        return () => {}
    }
}

module.exports = {PlayerMessage, JoinMessage, QuitMessage, SystemMessage, ErrorMessage}