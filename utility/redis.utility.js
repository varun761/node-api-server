require('dotenv').config();

const { createClient } = require('redis');

let client;

(async () => {
  client = createClient({
    url: process.env.REDIS_URL,
    socket: {
      keepAlive: 1000,
      reconnectStrategy: (retries) => Math.min(retries * 50, 500),
    },
  });

  client.on('connect', () => console.info('REDIS CONNECTED'));

  client.on('error', (err) => {
    console.error('--REDIS--ERROR ', err);
    // process.exit(1)
  });

  await client.connect();
})();

exports.setCachevalue = (key, value) => client.set(key, value, {
  EX: 120,
  NX: true,
});

exports.getCacheValue = (key) => client.get(key);

const deleteCacheByPattern = async (pattern, cursor = 0) => client.scan(cursor, 'MATCH', pattern, 'COUNT', '1000')
  .then(async (reply) => {
    if (reply.keys?.length > 0) {
      const deleteKeys = reply.keys.map((el) => client.del(el));
      await Promise.allSettled(deleteKeys);
      if (reply.cursor !== 0) return deleteCacheByPattern(pattern, reply.cursor);
    }
    return true;
  });

exports.deleteCacheByPattern = deleteCacheByPattern;
