const {Socket} = require('../../data_structures.cjs')
const zlib = require('zlib')

function Write(data) {
    return Array.from(zlib.gzipSync(Buffer.from(Uint8Array.from(data))))
}

function Read(data) {
    return Array.from(zlib.gunzipSync(Buffer.from(Uint8Array.from(data))))
}

module.exports = {Write, Read}