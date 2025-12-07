const { World, Socket } = require("../../data_structures.cjs");

/**
 * @param {World} world 
 * @param {number} uvni 
 */
function GetEntityRegistry(world, uvni) {
    for (var i = 0; i < world.registries.entity.length; i++) {
        if (uvni >= world.registries.entity[i].minUVNI && uvni <= world.registries.entity[i].maxUVNI) return i
        else if (uvni < world.registries.entity[i].minUVNI) return -1
    }

    return -1
}

/**
 * @param {World} world 
 * @param {number} registry 
 * @param {number | string} id 
 */
function GetEntityName(world, registry, id) {
    var thisRegistry = world.registries.entity[registry].entries
    var registryEntries = Object.keys(thisRegistry)

    if (typeof(id) == "number") {
        for (var i = 0; i < registryEntries.length; i++) {
            if (thisRegistry[registryEntries[i]].id == id) return registryEntries[i]
        }
    } else {
        for (var i = 0; i < registryEntries.length; i++) {
            if (thisRegistry[registryEntries[i]].name == id) return registryEntries[i]
        }
    }

    return "pig"
}

/**
 * @param {World} world 
 * @param {number} registry 
 * @param {string} entity 
 * @returns {number | {id: number, metadata: number}}
 */
function GetEntityID(world, registry, entity) {
    var entityID = world.registries.item[registry].entries[entity]

    if (entityID == undefined) return GetEntityID(world, registry, "pig")
    else return entityID.id
}

/**
 * @param {World} world 
 * @param {number} registry 
 * @param {string} entity 
 * @returns {number | {id: number, metadata: number}}
 */
function GetEntityInternalName(world, registry, entity) {
    var entityID = world.registries.item[registry].entries[entity]

    if (entityID == undefined) return GetEntityInternalName(world, registry, "pig")
    else return entityID.name
}

module.exports = {GetEntityRegistry, GetEntityID, GetEntityName, GetEntityInternalName}