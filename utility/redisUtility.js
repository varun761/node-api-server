require("dotenv").config()

const { createClient } = require("redis")

const client = createClient({
    url: process.env.REDIS_URL
})

client.connect()

client.on('connect', () => console.info('REDIS CONNECTED'))

client.on('error', (err) => {
    console.error('--REDIS--ERROR ', err)
    process.exit(1)
})

exports.setCachevalue = (key, value) => client.set(key, value)

exports.getCacheValue = (key) => client.get(key)
