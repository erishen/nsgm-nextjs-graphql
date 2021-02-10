const { projectConfig } = require('nsgm-cli')

const { version, prefix, protocol, host, port } = projectConfig

module.exports = {
    version: '1.0.0',
    prefix: '',
    protocol: 'http',
    host: '127.0.0.1', 
    port: 8080
}