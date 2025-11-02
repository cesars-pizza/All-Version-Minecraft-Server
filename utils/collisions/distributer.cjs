function PlayerCollidingWithBlock(socket) {
    if (socket.thisPlayer.upvn >= -1 && socket.thisPlayer.upvn <= 4) return require('./29.cjs').PlayerCollidingWithBlock
    if (socket.thisPlayer.upvn >= 8 && socket.thisPlayer.upvn <= 15) return require('./213.cjs').PlayerCollidingWithBlock
    else {
        socket.log(`ERR: Cannot Run Player Colliding With Block for Version ${socket.thisPlayer.upvn}:${socket.thisPlayer.uvni}`)
        return () => {}
    }
}

function PlayerCollidingWithBuildFloor(socket) {
    if (socket.thisPlayer.upvn >= -1 && socket.thisPlayer.upvn <= 4) return require('./29.cjs').PlayerCollidingWithBuildFloor
    if (socket.thisPlayer.upvn >= 8 && socket.thisPlayer.upvn <= 15) return require('./213.cjs').PlayerCollidingWithBuildFloor
    else {
        socket.log(`ERR: Cannot Run Player Colliding With Build Floor for Version ${socket.thisPlayer.upvn}:${socket.thisPlayer.uvni}`)
        return () => {}
    }
}

function PlayerCollidingWithBuildVolume(socket) {
    if (socket.thisPlayer.upvn >= -1 && socket.thisPlayer.upvn <= 4) return require('./29.cjs').PlayerCollidingWithBuildVolume
    if (socket.thisPlayer.upvn >= 8 && socket.thisPlayer.upvn <= 15) return require('./213.cjs').PlayerCollidingWithBuildVolume
    else {
        socket.log(`ERR: Cannot Run Player Colliding With Build Volume for Version ${socket.thisPlayer.upvn}:${socket.thisPlayer.uvni}`)
        return () => {}
    }
}

function CollidingWithFullBlock(playerPos, playerHeight, playerWidth, blockPos) {
    return require('./universal.cjs').CollidingWithFullBlock(playerPos, playerHeight, playerWidth, blockPos)
}

function CollidingWithPressurePlate(playerPos, playerHeight, playerWidth, blockPos) {
    return require('./universal.cjs').CollidingWithPressurePlate(playerPos, playerHeight, playerWidth, blockPos)
}

function PlayerCollisionFunctions(world, socket, position) {
    return require('./universal.cjs').PlayerCollisionFunctions(world, socket, position)
}

function PlayerCollisionPressurePlateFunction(world, socket, block, blockPos, collision) {
    return require('./universal.cjs').PlayerCollisionPressurePlateFunction(world, socket, block, blockPos, collision)
}

module.exports = {
    PlayerCollidingWithBlock, PlayerCollidingWithBuildFloor, PlayerCollidingWithBuildVolume, CollidingWithFullBlock, CollidingWithPressurePlate, PlayerCollisionFunctions, PlayerCollisionPressurePlateFunction
}