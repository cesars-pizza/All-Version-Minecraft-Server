const { World, Socket } = require("../../data_structures.cjs");

/**
 * @param {World} world 
 * @param {number} uvni 
 */
function GetItemRegistry(world, uvni) {
    for (var i = 0; i < world.registries.item.length; i++) {
        if (uvni >= world.registries.item[i].minUVNI && uvni <= world.registries.item[i].maxUVNI) return i
        else if (uvni < world.registries.item[i].minUVNI) return -1
    }

    return -1
}

/**
 * @param {World} world 
 * @param {number} registry 
 * @param {number | string} id 
 */
function GetItemName(world, registry, id) {
    var thisRegistry = world.registries.item[registry].entries
    var registryEntries = Object.keys(thisRegistry)

    if (typeof(id) == "number") {
        for (var i = 0; i < registryEntries.length; i++) {
            if (thisRegistry[registryEntries[i]] == id) return registryEntries[i]
            if (thisRegistry[registryEntries[i]] == `${id}:0`) return registryEntries[i]
        }
    } else {
        for (var i = 0; i < registryEntries.length; i++) {
            if (thisRegistry[registryEntries[i]] == id) return registryEntries[i]
            if (id.startsWith(thisRegistry[registryEntries[i]] + ':')) return registryEntries[i]
        }
    }

    return "air"
}

/**
 * @param {World} world 
 * @param {number} registry 
 * @param {string} item 
 * @returns {number | {id: number, metadata: number}}
 */
function GetItemID(world, registry, item) {
    var itemID = world.registries.item[registry].entries[item]

    if (itemID == undefined) return 0
    else return itemID
}

module.exports = {GetItemRegistry, GetItemName, GetItemID}