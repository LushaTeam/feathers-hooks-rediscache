import RedisCache from '../routes/helpers/redis';

const HTTP_OK = 200;
const HTTP_NO_CONTENT = 204;
const HTTP_SERVER_ERROR = 500;
const HTTP_NOT_FOUND = 404;

export function clearCache(rawTarget, query, url, client) {
  const h = new RedisCache(client);

  let target = decodeURIComponent(rawTarget);

  return new Promise((resolve, reject) => {
    // Formatted options following ?
    const hasQueryString = (query && (Object.keys(query).length !== 0));

    // Target should always be defined as Express router raises 404
    // as route is not handled
    if (target.length) {
      if (hasQueryString) {
        // Keep queries in a single string with the target
        target = decodeURIComponent(url.split('/').slice(3).join('/'));
      }

      // Gets the value of a key in the redis client
      client.get(`${target}`, (err, reply) => {
        if (err) {
          resolve({
            status: HTTP_SERVER_ERROR,
            message: 'something went wrong' + err.message
          });
        } else {
          // If the key existed
          if (reply) {
            // Clear existing cached key
            h.clearSingle(target).then(r => {
              resolve({
                message: `cache cleared for key (${hasQueryString ?
                  'with' : 'without'} params): ${target}`,
                status: HTTP_OK
              });
            });
          } else {
            /**
             * Empty reply means the key does not exist.
             * Must use HTTP_OK with express as HTTP's RFC stats 204 should not
             * provide a body, message would then be lost.
             */
            resolve({
              message: `cache already cleared for key (${hasQueryString ?
                'with' : 'without'} params): ${target}`,
              status: HTTP_NO_CONTENT
            });
          }

        }
      });
    } else {
      resolve({
        status: HTTP_NOT_FOUND
      });
    }
  });
};
