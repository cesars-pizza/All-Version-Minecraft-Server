const { World, Socket } = require("../../data_structures.cjs");

/**
 * @param {World} world 
 * @param {number} uvni 
 */
function GetBlockRegistry(world, uvni) {
    for (var i = 0; i < world.registries.block.length; i++) {
        if (uvni >= world.registries.block[i].minUVNI && uvni <= world.registries.block[i].maxUVNI) return i
        else if (uvni < world.registries.block[i].minUVNI) return -1
    }

    return -1
}

/**
 * @param {World} world 
 * @param {number} registry 
 * @param {number} id 
 */
function GetBlockName(world, registry, id) {
    var thisRegistry = world.registries.block[registry].entries
    var registryEntries = Object.keys(thisRegistry)
    
    for (var i = 0; i < registryEntries.length; i++) {
        if (typeof(thisRegistry[registryEntries[i]]) == "number") {
            if (thisRegistry[registryEntries[i]] == id) return registryEntries[i]
        } else {
            var blockStates = Object.keys(thisRegistry[registryEntries[i]].blockstatesShort)
            for (var j = 0; j < blockStates.length; j++) {
                if (thisRegistry[registryEntries[i]].blockstatesShort[blockStates[j]] == id) {
                    if (blockStates[j] == "*") return registryEntries[i]
                    else return `${registryEntries[i]}[${blockStates[j]}]`
                }
            }
        }
    }

    return "air"
}

/**
 * @param {World} world 
 * @param {number} registry 
 * @param {string} block 
 */
function GetBlockID(world, registry, block) {
    var blockName = ""
    var blockStates = {}
    if (block.includes('[')) {
        blockName = block.substring(0, block.indexOf('['))
        var blockStateTexts = block.slice(block.indexOf('[') + 1, -1).split(',')
        for (var i = 0; i < blockStateTexts.length; i++) {
            var splitBlockStateText = blockStateTexts[i].split('=')
            var thisState = splitBlockStateText[0]
            var thisStateValue = splitBlockStateText[1]

            blockStates[thisState] = thisStateValue
        }
    } else blockName = block

    var blockID = world.registries.block[registry].entries[blockName]
    if (blockID == undefined) return 0
    else {
        if (typeof(blockID) == "number") return blockID
        else {
            var selectedBlockStates = Object.keys(blockStates)
            var allBlockStates = Object.keys(blockID.states)
            for (var i = 0; i < allBlockStates.length; i++) {
                if (!selectedBlockStates.includes(allBlockStates[i])) blockStates[allBlockStates[i]] = blockID.states[allBlockStates[i]][0]
            }

            allBlockStates.sort()
            var stateText = "" 
            for (var i = 0; i < allBlockStates.length; i++) {
                if (i > 0) stateText += ","
                stateText += `${allBlockStates[i]}=${blockStates[allBlockStates[i]]}`
            }

            var blockStateIDs = Object.keys(blockID.blockstates)
            for (var i = 0; i < blockStateIDs.length; i++) {
                if (stateText == blockStateIDs[i]) return blockID.blockstates[blockStateIDs[i]]
            }

            return blockID.defaultID
        }
    }
}

module.exports = {GetBlockRegistry, GetBlockName, GetBlockID}