const nodeGeocoder = require('node-geocoder')

const options = {
    provider: 'mapquest',
    httpAdapter: 'https',
    apiKey: 'fAKGOmHhazSDZARvclMiJnQa33lLO1xo',
    formatter: null
}


const geocoder = nodeGeocoder(options)

module.exports = geocoder