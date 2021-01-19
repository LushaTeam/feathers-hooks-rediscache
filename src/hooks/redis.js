import moment from 'moment';
import chalk from 'chalk';
import { parsePath } from './helpers/path';
import makeDebug from 'debug';

const debug = makeDebug('feathers-hooks-rediscache:redis');

const defaults = {
  env: 'production',
  defaultDuration: 3600 * 24,
  immediateCacheKey: false,
  extendDuration: 0
};

export function before(options) { // eslint-disable-line no-unused-vars
  return function (hook) {
    const cacheOptions = hook.app.get('redisCache');

    options = Object.assign({}, defaults, cacheOptions, options);

    return new Promise(resolve => {
      const extendDuration = options.extendDuration || options.extendDuration;
      const client = hook.app.get('redisClient');

      if (!client) {
        resolve(hook);
      }

      const path = parsePath(hook, options);

      const callback = (err, reply) => {
        if (err !== null) resolve(hook);
        if (reply) {
          let data = JSON.parse(reply);
          const duration = moment(data.cache.expiresOn).format('DD MMMM YYYY - HH:mm:ss');

          hook.result = data;
          resolve(hook);

          /* istanbul ignore next */
          if (options.env !== 'test') {
            debug(`${chalk.cyan('[redis]')} returning cached value for ${chalk.green(path)}.`);
            debug(`> Expires on ${duration}.`);
          }
        } else {
          if (options.immediateCacheKey === true) {
            hook.params.cacheKey = path;
          }
          resolve(hook);
        }
      };

      if (extendDuration) {
        client.multi()
          .get(path, callback)
          .expire(path, extendDuration)
          .exec();
      } else {
        client.get(path, callback);
      }
    });
  };
};

export function after(options) { // eslint-disable-line no-unused-vars
  return function (hook) {
    const cacheOptions = hook.app.get('redisCache');

    options = Object.assign({}, defaults, cacheOptions, options);

    return new Promise(resolve => {
      if (!hook.result.cache.cached) {
        const duration = hook.result.cache.duration || options.defaultDuration;
        const client = hook.app.get('redisClient');

        if (!client) {
          resolve(hook);
        }

        const path = hook.params.cacheKey || parsePath(hook, options);

        // adding a cache object
        Object.assign(hook.result.cache, {
          cached: true,
          duration: duration,
          expiresOn: moment().add(moment.duration(duration, 'seconds')),
          parent: hook.path,
          key: path
        });

        client.set(path, JSON.stringify(hook.result));
        client.expire(path, hook.result.cache.duration);

        /* istanbul ignore next */
        if (options.env !== 'test') {
          debug(`${chalk.cyan('[redis]')} added ${chalk.green(path)} to the cache.`);
          debug(`> Expires in ${moment.duration(duration, 'seconds').humanize()}.`);
        }
      }

      if (hook.result.cache.hasOwnProperty('wrapped')) {
        const { wrapped } = hook.result.cache;

        hook.result = wrapped;
      }

      resolve(hook);
    });
  };
};

