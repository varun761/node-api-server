require("dotenv").config()

const { createClient } = require("redis")

let client;

(async () => {
    client = createClient({
        url: process.env.REDIS_URL
    })

    client.on('connect', () => console.info('REDIS CONNECTED'))

    client.on('error', (err) => {
        console.error('--REDIS--ERROR ', err)
        process.exit(1)
    })

    await client.connect()
})();

exports.setCachevalue = (key, value) => client.set(key, value, {
    EX: 60,
    NX: true
})

exports.getCacheValue = (key) => client.get(key)

exports.deleteCacheByPattern = (pattern) => new Promise(async (resolve, reject) => {
    let cursor = 0
    try {
        do {
            const reply = await client.scan(cursor, 'MATCH', pattern, 'COUNT', '1000');
            console.log('reply :', reply)
            cursor = reply.cursor;
            if (reply.keys && reply.keys.length > 0) {
                const deleteActions = reply.keys.map((el) => client.del(el))
                await Promise.all(deleteActions)
            }
        } while (cursor !== 0)
        resolve(true)
    } catch(e) {
        reject(e)
    }
})
