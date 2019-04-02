import redis from 'redis';
import chalk from 'chalk';
import makeDebug from 'debug';

const debug = makeDebug('feathers-hooks-rediscache:redisClient');

export default function redisClient() { // eslint-disable-line no-unused-vars
  const app = this;
  const cacheOptions = app.get('redisCache') || {};
  const retryInterval = cacheOptions.retryInterval || 10000;
  const redisOptions = Object.assign({}, this.get('redis'), {
    retry_strategy: function (options) { // eslint-disable-line camelcase
      app.set('redisClient', undefined);
      /* istanbul ignore next */
      if (cacheOptions.env !== 'test') {
        debug(`${chalk.yellow('[redis]')} not connected`);
      }
      return retryInterval;
    }
  });
  const client = redis.createClient(redisOptions);

  app.set('redisClient', client);

  client.on('ready', () => {
    app.set('redisClient', client);
    /* istanbul ignore next */
    if (cacheOptions.env !== 'test') {
      debug(`${chalk.green('[redis]')} connected`);
    }
  });
  return this;
}
