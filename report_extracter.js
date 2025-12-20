const fs = require('fs')

fs.writeFileSync('./blocks.txt', Object.keys(JSON.parse(fs.readFileSync('C:\\Users\\cesar\\Downloads\\Classic Minecraft Server\\generated\\reports\\blocks.json'))).map(block => block.substring(10)).join('\n'))
