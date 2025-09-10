class Socket {
    /**
     * @param {string} logText 
     * @param {number} index 
     * @param {(message: string, consoleLog: boolean) => void} log 
     * @param {(id: number, identifier: string, data: number[], logBytes: boolean | null, consoleLog: boolean | null) => void} writePacket 
     * @param {number} packetCount
     * @param {boolean} identified
     * @param {number} upvn
     * @param {number} uvni 
     * @param {Buffer} dataBuffer    
     */
    constructor(logText, index, log, writePacket, packetCount, identified, upvn, uvni, dataBuffer) {
        this.logText = logText
        this.index = index
        this.log = log
        this.writePacket = writePacket
        this.packetCount = packetCount
        this.identified = identified
        this.upvn = upvn
        this.uvni = uvni
        this.dataBuffer = dataBuffer
    }
}

module.exports = {Socket}