const {Socket} = require('../../data_structures.cjs')
const zlib = require('zlib')

function Write(data) {
    return Array.from(zlib.deflateSync(Buffer.from(Uint8Array.from(data))))
}

module.exports = {Write}