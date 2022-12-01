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

/* exports.deleteCacheByPattern = async (pattern) => {
  let cursor = 0;
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
  return true;
}; */

/* exports.deleteCacheByPattern = (pattern) => new Promise((resolve, reject) => {
  let deleteKeys = [];
  client.scan(0, 'MATCH', pattern, 'COUNT', '1000')
    .then((reply) => {
      if (reply.keys && reply.keys.length > 0) {
        deleteKeys = [...reply.keys];
      }
      Promise.allSettled(deleteKeys.map((el) => client.del(el)))
        .then(() => {
          resolve(true);
        })
        .catch(reject);
    });
}); */

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
