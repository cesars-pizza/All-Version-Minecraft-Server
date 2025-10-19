const net = require('net')

class Socket extends net.Socket {
    /**
     * @param {boolean} isClosed
     * @param {string} logText 
     * @param {number} index 
     * @param {(message: string, consoleLog: boolean | null) => void} log 
     * @param {(id: number, identifier: string, data: number[], logBytes: boolean | null, consoleLog: boolean | null) => void} writePacket 
     * @param {(disconnectReason: string, consoleLog: boolean | null) => void} setDisconnect 
     * @param {number} packetCount
     * @param {boolean} identified
     * @param {Buffer} dataBuffer    
     * @param {Player} thisPlayer 
     * @param {"" | "maxPlayers" | "multipleInstances" | "invalidVersion" | "unverified" | "serverClosed"} disconnect 
     */
    constructor(isClosed, logText, index, log, writePacket, setDisconnect, packetCount, identified, upvn, uvni, dataBuffer, thisPlayer, disconnect) {
        this.isClosed = isClosed
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
     * @param {string} serverName 
     * @param {string} serverStatus 
     * @param {number} hostPort 
     * @param {boolean} suppressNonUniversalBlocks 
     */
    constructor(minUPVN, maxUPVN, maxPlayers, serverName, serverStatus, hostPort, suppressNonUniversalBlocks) {
        this.minUPVN = minUPVN
        this.maxUPVN = maxUPVN
        this.maxPlayers = maxPlayers
        this.serverName = serverName
        this.serverStatus = serverStatus
        this.hostPort = hostPort
        this.suppressNonUniversalBlocks = suppressNonUniversalBlocks
    }
}

class World {
    /**
     * @param {Config} config 
     * @param {Player[]} players 
     * @param {number} maxPlayerCount 
     * @param {string[]} loadingPlayerNames 
     * @param {Player[]} loadedPlayers
     * @param {{block: BlockRegistry[], item: Registry[]}} registries 
     * @param {Build[]} builds
     * @param {TickBlock[]} blockUpdates
     * @param {{tag: string, values: string[]}[]} tags 
     * @param {{classicID: number, username: string}[]} disconnectedPlayers 
     * @param {{supported: boolean, name: string, pvn: number}[]} versions 
     * @param {{block: string[], item: string[]}} universalRegistries 
     * @param {{save: () => {}}} serverFunctions 
     * @param {boolean} closeServer
     */
    constructor(config, players, maxPlayerCount, loadingPlayerNames, loadedPlayers, registries, builds, blockUpdates, tags, disconnectedPlayers, versions, universalRegistries, serverFunctions, closeServer) {
        this.config = config
        this.players = players
        this.maxPlayerCount = maxPlayerCount
        this.loadingPlayerNames = loadingPlayerNames
        this.loadedPlayers = loadedPlayers
        this.registries = registries
        this.builds = builds
        this.blockUpdates = blockUpdates
        this.disconnectedPlayers = disconnectedPlayers
        this.versions = versions
        this.universalRegistries = universalRegistries
        this.serverFunctions = serverFunctions
        this.closeServer = closeServer
        this.tags = tags
    }
}

class Player {
    /**
     * @param {string} uuid 
     * @param {string} username 
     * @param {Position} position 
     * @param {Rotation} rotation 
     * @param {{x: number, z: number}} classicWorldOffset
     * @param {{selected_slot: number, slots: Slot[], bucket_tracker: {empty: number, water: number, lava: number}}} inventory 
     * @param {{showPlotInfo: boolean, defaultBuildSettings: {blockUpdates: boolean, redstoneUpdates: boolean, liquidUpdates: boolean, publicInteractions}}} settings
     * @param {boolean} verified 
     * @param {boolean} keepUnverified 
     * @param {number} lastUVNI 
     * @param {number} classicID 
     * @param {number} alphaID 
     * @param {boolean} inWorld 
     * @param {boolean} allowMovement
     * @param {{spawn: boolean, position: boolean, rotation: boolean, messages: string[], systemMessages: string[], errorMessages: string[], teleportSelf: boolean, teleportOthers: boolean}} tick 
     * @param {boolean} save 
     * @param {number} upvn 
     * @param {number} uvni
     * @param {{block: number, item: number}} selectedRegistries  
     * @param {number} floorChangeCooldown
     * @param {{blockPos: Position, ticks: number}} digging 
     * @param {number} joinCount
     * @param {Socket} socket
     */
    constructor(uuid, username, position, rotation, classicWorldOffset, inventory, settings, verified, keepUnverified, lastUVNI, classicID, alphaID, inWorld, allowMovement, tick, save, upvn, uvni, selectedRegistries, floorChangeCooldown, digging, joinCount, socket) {
        this.uuid = uuid
        this.username = username
        this.position = position
        this.rotation = rotation
        this.classicWorldOffset = classicWorldOffset
        this.inventory = inventory
        this.settings = settings
        this.verified = verified
        this.keepUnverified = keepUnverified
        this.lastUVNI = lastUVNI
        this.classicID = classicID
        this.alphaID = alphaID
        this.inWorld = inWorld
        this.allowMovement = allowMovement
        this.tick = tick
        this.save = save
        this.upvn = upvn
        this.uvni = uvni
        this.selectedRegistries = selectedRegistries
        this.floorChangeCooldown = floorChangeCooldown
        this.digging = digging
        this.joinCount = joinCount
        this.socket = socket
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

class Registry {
    /**
     * @param {number} minUVNI 
     * @param {number} maxUVNI 
     * @param {number} minUPVN 
     * @param {number} maxUPVN 
     * @param {{}} entries 
     */
    constructor(minUVNI, maxUVNI, minUPVN, maxUPVN, entries) {
        this.minUVNI = minUVNI
        this.maxUVNI = maxUVNI
        this.minUPVN = minUPVN
        this.maxUPVN = maxUPVN
        this.entries = entries
    }
}

class BlockRegistry {
    /**
     * @param {number} minUVNI 
     * @param {number} maxUVNI 
     * @param {number} minUPVN 
     * @param {number} maxUPVN 
     * @param {{_entry: number | {states: {_state: string[]}, blockstates: {"_state=_value": number}, defaultID: number}}} entries 
     */
    constructor(minUVNI, maxUVNI, minUPVN, maxUPVN, entries) {
        this.minUVNI = minUVNI
        this.maxUVNI = maxUVNI
        this.minUPVN = minUPVN
        this.maxUPVN = maxUPVN
        this.entries = entries
    }
}

class Build {
    /**
     * @param {number} x 
     * @param {number} z 
     * @param {string} creator 
     * @param {"small"} size 
     * @param {string[][][]} blocks 
     * @param {string} floor 
     * @param {number} uvni 
     * @param {number} created 
     * @param {number} lastModified 
     * @param {boolean} save 
     * @param {{blockUpdates: boolean, redstoneUpdates: boolean, liquidUpdates: boolean, publicInteractions}} settings
     * @param {{position: Position, blockID: string, prevBlockID: string, priority: number, doubleSet: boolean, delay: number}[]} scheduledBlockUpdates 
     */
    constructor(x, z, creator, size, blocks, floor, uvni, created, lastModified, save, settings, scheduledBlockUpdates) {
        this.x = x
        this.z = z
        this.creator = creator
        this.size = size
        this.blocks = blocks
        this.floor = floor
        this.uvni = uvni
        this.created = created
        this.lastModified = lastModified
        this.save = save
        this.settings = settings
        this.scheduledBlockUpdates = scheduledBlockUpdates
    }
}

class TickBlock {
    /**
     * @param {number} x 
     * @param {number} y 
     * @param {number} z 
     * @param {number} id 
     * @param {boolean} doubleSet 
     */
    constructor(x, y, z, id, doubleSet) {
        this.x = x
        this.y = y
        this.z = z
        this.id = id
        this.doubleSet = doubleSet
    }
}

module.exports = {Socket, Config, World, Position, Rotation, Slot, Player, Registry, TickBlock, BlockRegistry, Build}