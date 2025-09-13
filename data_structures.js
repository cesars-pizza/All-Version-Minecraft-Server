class Socket {
    /**
     * @param {string} logText 
     * @param {number} index 
     * @param {(message: string, consoleLog: boolean | null) => void} log 
     * @param {(id: number, identifier: string, data: number[], logBytes: boolean | null, consoleLog: boolean | null) => void} writePacket 
     * @param {(disconnectReason: string, consoleLog: boolean | null) => void} setDisconnect 
     * @param {number} packetCount
     * @param {boolean} identified
     * @param {number} upvn
     * @param {number} uvni 
     * @param {Buffer} dataBuffer    
     * @param {InGamePlayer} thisPlayer 
     * @param {"" | "maxPlayers" | "multipleInstance" | "invalidVersion" | "unverified"} disconnect 
     */
    constructor(logText, index, log, writePacket, setDisconnect, packetCount, identified, upvn, uvni, dataBuffer, thisPlayer, disconnect) {
        this.logText = logText
        this.index = index
        this.log = log
        this.writePacket = writePacket
        this.setDisconnect = setDisconnect
        this.packetCount = packetCount
        this.identified = identified
        this.upvn = upvn
        this.uvni = uvni
        this.dataBuffer = dataBuffer
        this.thisPlayer = thisPlayer
        this.disconnect = disconnect
    }
}

class Config {
    /**
     * @param {number} minUPVN 
     * @param {number} maxUPVN 
     * @param {number} maxPlayers 
     */
    constructor(minUPVN, maxUPVN, maxPlayers) {
        this.minUPVN = minUPVN
        this.maxUPVN = maxUPVN
        this.maxPlayers = maxPlayers
    }
}

class World {
    /**
     * @param {Config} config 
     * @param {Player[]} players 
     * @param {number} maxPlayerCount 
     * @param {string[]} loadingPlayerNames 
     * @param {InGamePlayer[]} loadedPlayers
     */
    constructor(config, players, maxPlayerCount, loadingPlayerNames, loadedPlayers) {
        this.config = config
        this.players = players
        this.maxPlayerCount = maxPlayerCount
        this.loadingPlayerNames = loadingPlayerNames
        this.loadedPlayers = loadedPlayers
    }
}

class Player {
    /**
     * @param {string} uuid 
     * @param {string} username 
     * @param {Position} position 
     * @param {Rotation} rotation 
     * @param {{selected_slot: number, slots: Slot[]}} inventory 
     * @param {boolean} verified 
     * @param {boolean} keepUnverified 
     * @param {number} lastUVNI 
     * @param {boolean} save 
     */
    constructor(uuid, username, position, rotation, inventory, verified, keepUnverified, lastUVNI, save) {
        this.uuid = uuid
        this.username = username
        this.position = position
        this.rotation = rotation
        this.inventory = inventory
        this.verified = verified
        this.keepUnverified = keepUnverified
        this.lastUVNI = lastUVNI
        this.save = save
    }
}

class InGamePlayer {
    /**
     * @param {string} uuid 
     * @param {string} username 
     * @param {Position} position 
     * @param {Rotation} rotation 
     * @param {{selected_slot: number, slots: Slot[]}} inventory 
     * @param {boolean} verified 
     * @param {boolean} keepUnverified 
     * @param {number} lastUVNI 
     * @param {number} classicID 
     * @param {boolean} inWorld 
     * @param {{spawn: boolean, position: boolean, rotation: boolean}} tick 
     * @param {boolean} save 
     */
    constructor(uuid, username, position, rotation, inventory, verified, keepUnverified, lastUVNI, classicID, inWorld, tick, save) {
        this.uuid = uuid
        this.username = username
        this.position = position
        this.rotation = rotation
        this.inventory = inventory
        this.verified = verified
        this.keepUnverified = keepUnverified
        this.lastUVNI = lastUVNI
        this.classicID = classicID
        this.inWorld = inWorld
        this.tick = tick
        this.save = save
    }
}

class Slot {
    /**
     * @param {number} slot 
     * @param {string} id 
     * @param {number} count
     * @param {[]} added_components 
     * @param {[]} removed_components 
     */
    constructor(slot, id, count, added_components, removed_components) {
        this.slot = slot
        this.id = id
        this.count = count
        this.added_components = added_components
        this.removed_components = removed_components
    }
}

class Position {
    /**
     * @param {number} x 
     * @param {number} y 
     * @param {number} z
     */
    constructor(x, y, z) {
        this.x = x
        this.y = y
        this.z = z
    }
}

class Rotation {
    /**
     * @param {number} pitch 
     * @param {number} yaw 
     */
    constructor(pitch, yaw) {
        this.pitch = pitch
        this.yaw = yaw
    }
}

module.exports = {Socket, Config, World, Position, Rotation, Slot, Player, InGamePlayer}