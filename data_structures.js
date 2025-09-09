class Socket {
    /**
     * @param {string} logText 
     * @param {number} index 
     * @param {(message: string, consoleLog: boolean) => void} log 
     * @param {(id: number, identifier: string, data: number[], logBytes: boolean | null, consoleLog: boolean | null) => void} writePacket 
     * @param {(id: number, identifier: string, logBytes: boolean | null, consoleLog: boolean | null) => void} writeEmptyPacket 
     * @param {(id: number, identifier: string, data: number[], logBytes: boolean | null, consoleLog: boolean | null) => void} bufferPacket 
     * @param {(id: number, identifier: string, logBytes: boolean | null, consoleLog: boolean | null) => void} bufferEmptyPacket 
     * @param {() => void} writeBufferedPackets
     * @param {number} packetCount
     * @param {boolean} identified
     * @param {number} upvn
     * @param {number} uvni 
     * @param {Buffer} dataBuffer    
     */
    constructor(logText, index, log, writePacket, writeEmptyPacket, bufferPacket, bufferEmptyPacket, writeBufferedPackets, packetCount, identified, upvn, uvni, dataBuffer) {
        this.logText = logText
        this.index = index
        this.log = log
        this.writePacket = writePacket
        this.writeEmptyPacket = writeEmptyPacket
        this.bufferPacket = bufferPacket
        this.bufferEmptyPacket = bufferEmptyPacket
        this.writeBufferedPackets = writeBufferedPackets
        this.packetCount = packetCount
        this.identified = identified
        this.upvn = upvn
        this.uvni = uvni
        this.dataBuffer = dataBuffer
    }
}

module.exports = {Socket}