const net = require('net')

class Socket extends net.Socket {
    /**
     * @param {boolean} isClosed
     * @param {string} logText 
     * @param {number} index 
     * @param {(message: string, consoleLog: boolean | null) => void} log 
     * @param {(id: number, identifier: string, data: number[], logBytes: boolean | null, consoleLog: boolean | null) => void} writePacket 
     * @param {(disconnectReason: string, consoleLog: boolean | null) => void} setDisconnect 
     * @param {(log: string) => void} endConnection 
     * @param {number} packetCount
     * @param {boolean} identified
     * @param {number} upvn
     * @param {number} uvni  
     * @param {Buffer} dataBuffer    
     * @param {Player} thisPlayer 
     * @param {"" | "maxPlayers" | "multipleInstances" | "invalidVersion" | "unverified" | "serverClosed"} disconnect 
     */
    constructor(isClosed, logText, index, log, writePacket, setDisconnect, endConnection, packetCount, identified, upvn, uvni, dataBuffer, thisPlayer, disconnect) {
        this.isClosed = isClosed
        this.logText = logText
        this.index = index
        this.log = log
        this.writePacket = writePacket
        this.setDisconnect = setDisconnect
        this.endConnection = endConnection
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
     * @param {{min: number, default: number, max: number}} renderDistance 
     * @param {number} simulationDistance 
     */
    constructor(minUPVN, maxUPVN, maxPlayers, serverName, serverStatus, hostPort, suppressNonUniversalBlocks, renderDistance, simulationDistance) {
        this.minUPVN = minUPVN
        this.maxUPVN = maxUPVN
        this.maxPlayers = maxPlayers
        this.serverName = serverName
        this.serverStatus = serverStatus
        this.hostPort = hostPort
        this.suppressNonUniversalBlocks = suppressNonUniversalBlocks
        this.renderDistance = renderDistance
        this.simulationDistance = simulationDistance
    }
}

class World {
    /**
     * @param {Config} config 
     * @param {Player[]} players 
     * @param {number} maxPlayerCount 
     * @param {string[]} loadingPlayerNames 
     * @param {Player[]} loadedPlayers
     * @param {{block: BlockRegistry[], item: Registry[], entity: Registry[]}} registries 
     * @param {Registry} blockStateData
     * @param {Build[]} builds
     * @param {TickBlock[]} blockUpdates
     * @param {TickBlockEntity[]} blockEntityUpdates
     * @param {{tag: string, values: string[]}[]} tags 
     * @param {{classicID: number, alphaID: number, username: string}[]} disconnectedPlayers 
     * @param {{supported: boolean, name: string, pvn: number}[]} versions 
     * @param {{block: string[], item: string[], entity: string[]}} universalRegistries 
     * @param {{save: () => {}}} serverFunctions 
     * @param {boolean} closeServer
     */
    constructor(config, players, maxPlayerCount, loadingPlayerNames, loadedPlayers, registries, blockStateData, builds, blockUpdates, blockEntityUpdates, tags, disconnectedPlayers, versions, universalRegistries, serverFunctions, closeServer) {
        this.config = config
        this.players = players
        this.maxPlayerCount = maxPlayerCount
        this.loadingPlayerNames = loadingPlayerNames
        this.loadedPlayers = loadedPlayers
        this.registries = registries
        this.blockStateData = blockStateData
        this.builds = builds
        this.blockUpdates = blockUpdates
        this.blockEntityUpdates = blockEntityUpdates
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
     * @param {{selected_slot: number, held_item: string, slots: Inventory, bucket_tracker: {empty: number, water: number, lava: number}}} inventory 
     * @param {{showPlotInfo: boolean, defaultBuildSettings: {blockUpdates: boolean, redstoneUpdates: boolean, liquidUpdates: boolean, publicInteractions: boolean}}} settings
     * @param {boolean} verified 
     * @param {boolean} keepUnverified 
     * @param {number} lastUVNI 
     * @param {number} classicID 
     * @param {number} alphaID 
     * @param {boolean} inWorld 
     * @param {boolean} allowMovement
     * @param {{spawn: boolean, position: {tick: boolean, x: number, y: number, z: number}, rotation: boolean, messages: string[], systemMessages: string[], errorMessages: string[], teleportSelf: boolean, teleportOthers: boolean, heldItem: boolean}} tick 
     * @param {boolean} save 
     * @param {number} upvn 
     * @param {number} uvni
     * @param {{block: number, item: number, entity: number}} selectedRegistries  
     * @param {number} floorChangeCooldown
     * @param {{blockPos: Position, ticks: number}} digging 
     * @param {number} currentTime
     * @param {{}} otherPlayers 
     * @param {number} joinCount
     * @param {Socket} socket
     */
    constructor(uuid, username, position, rotation, classicWorldOffset, inventory, settings, verified, keepUnverified, lastUVNI, classicID, alphaID, inWorld, allowMovement, tick, save, upvn, uvni, selectedRegistries, floorChangeCooldown, digging, currentTime, otherPlayers, joinCount, socket) {
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
        this.currentTime = currentTime
        this.otherPlayers = otherPlayers
        this.joinCount = joinCount
        this.socket = socket
    }
}

class Slot {
    /**
     * @param {string} id 
     * @param {number} count
     * @param {[]} added_components 
     * @param {[]} removed_components 
     */
    constructor(id, count, added_components, removed_components) {
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
     * @param {{}[]} blockEntities
     * @param {string} floor 
     * @param {number} uvni 
     * @param {number} created 
     * @param {number} lastModified 
     * @param {boolean} save 
     * @param {{blockUpdates: boolean, redstoneUpdates: boolean, liquidUpdates: boolean, publicInteractions: boolean, time: number}} settings
     * @param {{enabled: boolean, disc: string, blockPos: Position}} music 
     * @param {{position: Position, blockID: string, prevBlockID: string, priority: number, doubleSet: boolean, delay: number}[]} scheduledBlockUpdates 
     * @param {string[]} nearbyPlayers 
     */
    constructor(x, z, creator, size, blocks, blockEntities, floor, uvni, created, lastModified, save, settings, music, scheduledBlockUpdates, nearbyPlayers) {
        this.x = x
        this.z = z
        this.creator = creator
        this.size = size
        this.blocks = blocks
        this.blockEntities = blockEntities
        this.floor = floor
        this.uvni = uvni
        this.created = created
        this.lastModified = lastModified
        this.save = save
        this.settings = settings
        this.music = music
        this.scheduledBlockUpdates = scheduledBlockUpdates
        this.nearbyPlayers = nearbyPlayers
    }
}

class TickBlock {
    /**
     * @param {number} x 
     * @param {number} y 
     * @param {number} z 
     * @param {string} id 
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

class TickBlockEntity {
    /**
     * @param {number} x 
     * @param {number} y 
     * @param {number} z 
     * @param {{}} data
     */
    constructor(x, y, z, data) {
        this.x = x
        this.y = y
        this.z = z
        this.data = data
    }
}

class Inventory {
    /**
     * @param {"playerMain" | "playerArmor" | "playerCraftingSlots" | "player"} type 
     * @param {Slot[]} hotbar
     * @param {Slot[]} inventory
     * @param {{head: Slot, chest: Slot, legs: Slot, feet: Slot}} armor
     * @param {{crafting: Slot[]}} player
     */
    constructor(type, hotbar, inventory, armor, player) {
        this.type = type
        this.hotbar = hotbar
        this.inventory = inventory
        this.armor = armor
        this.player = player
    }
}

module.exports = {Socket, Config, World, Position, Rotation, Slot, Player, Registry, TickBlock, TickBlockEntity, BlockRegistry, Build, Inventory}