const {World, Config, Build} = require('../data_structures.cjs')
const fs = require('fs')

/**
 * @type {World}
 */
var world = {
    config: new Config(),
    players: [],
    maxPlayerCount: 0,
    loadingPlayerNames: [],
    loadedPlayers: [],
    registries: {
        block: [],
        item: [],
        entity: []
    },
    builds: [],
    blockUpdates: [],
    tags: [],
    disconnectedPlayers: [],
    versions: [],
    universalRegistries: {
        block: [],
        item: []
    },
    serverFunctions: {
        save: () => {}
    },
    closeServer: false
}

async function loadWorld() {
    loadConfig()

    loadPlayers()

    loadRegistry('block', 'block', 'Block Registries', 'Universal Blocks')
    loadRegistry('item', 'item', 'Item Registries', 'Universal Items')
    loadRegistry('entity', 'entity', 'Entity Registries', 'Universal Entities')

    loadVersions()

    loadBuilds()

    loadTags()

    return world
}

async function loadConfig() {
    world.config = JSON.parse(fs.readFileSync('./config.json'))
    
    var maxHandledPlayers = 32767
    if (world.config.minUPVN <= 4) maxHandledPlayers = 127

    world.maxPlayerCount = world.config.maxPlayers
    
    if (world.config.maxPlayers > maxHandledPlayers) {
        console.log(`WARNING Max players reduced from ${world.config.maxPlayers} to ${maxHandledPlayers}`)
        world.maxPlayerCount = maxHandledPlayers
    }

    if (world.config.renderDistance.min > 32) {
        console.log(`WARNING Minimum render distance reduced from ${world.config.renderDistance.min} to 32`)
        world.config.renderDistance.min = 32
    }

    if (world.config.renderDistance.default > 32) {
        console.log(`WARNING Default render distance reduced from ${world.config.renderDistance.default} to 32`)
        world.config.renderDistance.default = 32
    }

    if (world.config.renderDistance.max > 32) {
        console.log(`WARNING Maximum render distance reduced from ${world.config.renderDistance.max} to 32`)
        world.config.renderDistance.max = 32
    }

    if (world.config.renderDistance.default < world.config.renderDistance.min) {
        console.log(`WARNING Default render distance increased from ${world.config.renderDistance.default} to ${world.config.renderDistance.min}`)
        world.config.renderDistance.default = world.config.renderDistance.min
    }

    if (world.config.renderDistance.max < world.config.renderDistance.default) {
        console.log(`WARNING Maximum render distance increased from ${world.config.renderDistance.max} to ${world.config.renderDistance.default}`)
        world.config.renderDistance.max = world.config.renderDistance.default
    }

    console.log("WORLD Loaded Config")
}

async function loadPlayers() {
    if (!fs.existsSync('./world/players')) {
        fs.mkdirSync('./world/players')
        console.log(`WORLD Loaded 0 Players`)
        return
    }

    var playerFiles = fs.opendirSync('./world/players')
    var endOfPlayers = false
    while (!endOfPlayers) {
        var thisPlayer = playerFiles.readSync()
        if (thisPlayer == null) endOfPlayers = true
        else {
            if (thisPlayer.isFile() && thisPlayer.name.endsWith('.json')) {
                var thisPlayerData = JSON.parse(fs.readFileSync(`./world/players/${thisPlayer.name}`))
                thisPlayerData.classicID = -1
                thisPlayerData.inWorld = false
                thisPlayerData.tick = {
                    spawn: false,
                    position: false,
                    rotation: false,
                    messages: [],
                    systemMessages: [],
                    teleportSelf: false
                }
                thisPlayerData.save = false
                thisPlayerData.upvn = -2
                thisPlayerData.uvni = -1
                thisPlayerData.selectedRegistries = {
                    block: -1
                }
                thisPlayerData.socket = {}
                world.players.push(thisPlayerData)
            }
        }
    }
    playerFiles.closeSync()

    console.log(`WORLD Loaded ${world.players.length} Players`)
}

async function loadRegistry(registry, folder, registryLog, universalLog) {
    var registryFolder = fs.opendirSync(`./world/registries/${folder}`)
    var startedBlockRegistry = false
    var endofRegistry = false
    while (!endofRegistry) {
        var thisRegistry = registryFolder.readSync()
        if (thisRegistry == null) endofRegistry = true
        else {
            if (thisRegistry.isFile()) {
                var nameNumber = Number(thisRegistry.name.replace('.json', ''))
                if (thisRegistry.name.endsWith('.json') && nameNumber != NaN) {
                    var thisRegistryData = JSON.parse(fs.readFileSync(`./world/registries/${folder}/${thisRegistry.name}`))
                    if (thisRegistryData.maxUPVN >= world.config.minUPVN && thisRegistryData.minUPVN <= world.config.maxUPVN) {
                        var entryKeys = Object.keys(thisRegistryData.entries)
                        if (startedBlockRegistry) {
                            for (var i = world.universalRegistries[registry].length - 1; i >= 0; i--) {
                                if (!entryKeys.includes(world.universalRegistries[registry][i])) world.universalRegistries[registry].splice(i, 1)
                            }
                        } else {
                            startedBlockRegistry = true
                            world.universalRegistries[registry] = entryKeys
                        }
                    }
                    world.registries[registry].push(thisRegistryData)
                }
            }
        }
    }
    registryFolder.closeSync()

    if (registry == "block") {
        world.blockStateData = JSON.parse(fs.readFileSync(`./world/registries/blockStates.json`))
        console.log(`WORLD Loaded ${world.registries[registry].length + 1} ${registryLog}`)
    } else console.log(`WORLD Loaded ${world.registries[registry].length} ${registryLog}`)

    console.log(`WORLD Loaded ${world.universalRegistries[registry].length} ${universalLog}`)
}

async function loadVersions() {
    world.versions = JSON.parse(fs.readFileSync('./world/registries/version.json'))

    console.log(`WORLD Loaded ${world.versions.length} Versions`)
}

async function loadBuilds() {
    if (!fs.existsSync('./world/builds')) {
        fs.mkdirSync('./world/builds')
        console.log(`WORLD Loaded 0 Builds`)
        return
    }

    var buildFiles = fs.opendirSync('./world/builds')
    var endOfBuilds = false
    while (!endOfBuilds) {
        var thisBuild = buildFiles.readSync()
        if (thisBuild == null) endOfBuilds = true
        else {
            if (thisBuild.isFile() && thisBuild.name.endsWith('.json')) {
                /** @type {Build} */
                var thisBuildData = JSON.parse(fs.readFileSync(`./world/builds/${thisBuild.name}`))
                thisBuildData.save = false
                thisBuildData.nearbyPlayers = []
                world.builds.push(thisBuildData)
            }
        }
    }
    buildFiles.closeSync()

    console.log(`WORLD Loaded ${world.builds.length} Builds`)
}

async function loadTags() {
    var tagFiles = fs.opendirSync('./world/tags')
    var endOfTags = false
    while (!endOfTags) {
        var thisTag = tagFiles.readSync()
        if (thisTag == null) endOfTags = true
        else {
            if (thisTag.isFile() && thisTag.name.endsWith('.json')) {
                /** @type {{tag: string, values: string[]}} */
                var thisTagData = JSON.parse(fs.readFileSync(`./world/tags/${thisTag.name}`))
                world.tags.push(thisTagData)
            }
        }
    }
    tagFiles.closeSync()

    for (var i = 0; i < world.tags.length; i++) {
        var passed = false
        while (!passed) {
            passed = true

            for (var j = 0; j < world.tags[i].values.length; j++) {
                if (world.tags[i].values[j][0] == "#") {
                    passed = false
                    var subTag = world.tags[i].values[j].substring(1)
                    var subTagIndex = world.tags.map(tag => tag.tag).indexOf(subTag)

                    world.tags[i].values.splice(j, 1)

                    world.tags[i].values = world.tags[i].values.concat(world.tags[subTagIndex].values)
                }
            }
        }
    }

    console.log(`WORLD Loaded ${world.tags.length} Tags`)
}

module.exports = {loadWorld}