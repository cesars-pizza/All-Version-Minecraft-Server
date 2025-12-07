const fs = require('fs')
const dataReader = require('./data_handlers/data_reader.cjs')

const worldFolder = "C:\\Users\\cesar\\AppData\\Roaming\\.betacraft\\JE Alpha v1.1.0\\saves\\World1"

var worldSections = fs.readdirSync(worldFolder)

worldSections = worldSections.map(topFolder => {
    if (topFolder.includes('.')) return undefined
    else return fs.readdirSync(`${worldFolder}/${topFolder}`).map(subFolder => `${topFolder}/${subFolder}/${fs.readdirSync(`${worldFolder}/${topFolder}/${subFolder}`)[0]}`)
}).flat()

for (var i = 0; i < worldSections.length; i++) {
    if (worldSections[i] == undefined) continue

    var sectionData = fs.readFileSync(`${worldFolder}/${worldSections[i]}`)
    var nbtData = dataReader.readNBT({thisPlayer: {upvn: 11}}, dataReader.readGZip({thisPlayer: {upvn: 11}}, sectionData, 0), 0)

    if (nbtData.value.Level.value.TileEntities.value.length != 0) {
        console.log(worldSections[i])
    }
}