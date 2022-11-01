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
  EX: 60,
  NX: true,
});

exports.getCacheValue = (key) => client.get(key);

// eslint-disable-next-line no-async-promise-executor
exports.deleteCacheByPattern = (pattern) => new Promise(async (resolve, reject) => {
  let cursor = 0;
  try {
    do {
      // eslint-disable-next-line no-await-in-loop
      const reply = await client.scan(cursor, 'MATCH', pattern, 'COUNT', '1000');
      cursor = reply.cursor;
      if (reply.keys && reply.keys.length > 0) {
        // eslint-disable-next-line no-loop-func
        const deleteActions = reply.keys.map((el) => client.del(el));
        // eslint-disable-next-line no-await-in-loop
        await Promise.all(deleteActions);
      }
    } while (cursor !== 0);
    resolve(true);
  } catch (e) {
    reject(e);
  }
});
