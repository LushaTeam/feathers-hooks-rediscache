(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("library", [], factory);
	else if(typeof exports === 'object')
		exports["library"] = factory();
	else
		root["library"] = factory();
})(global, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/hooks/cache.js":
/*!****************************!*\
  !*** ./src/hooks/cache.js ***!
  \****************************/
/*! exports provided: cache, removeCacheInformation */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "cache", function() { return cache; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "removeCacheInformation", function() { return removeCacheInformation; });
/**
 * After hook - generates a cache object that is needed
 * for the redis hook and the express middelware.
 */
const defaults = {
  defaultDuration: 3600 * 24
};
function cache(options) {
  // eslint-disable-line no-unused-vars
  return function (hook) {
    const cacheOptions = hook.app.get('redisCache');
    options = Object.assign({}, defaults, cacheOptions, options);

    if (!hook.result.hasOwnProperty('cache')) {
      let cache = {};

      if (Array.isArray(hook.result)) {
        const array = hook.result;
        cache.wrapped = array;
        hook.result = {};
      }

      cache = Object.assign({}, cache, {
        cached: false,
        duration: options.duration || options.defaultDuration
      });
      hook.result.cache = cache;
    }

    return Promise.resolve(hook);
  };
}
;
function removeCacheInformation(options) {
  // eslint-disable-line no-unused-vars
  return function (hook) {
    if (hook.result.hasOwnProperty('cache')) {
      delete hook.result.cache;
    }

    return Promise.resolve(hook);
  };
}
;

/***/ }),

/***/ "./src/hooks/helpers/path.js":
/*!***********************************!*\
  !*** ./src/hooks/helpers/path.js ***!
  \***********************************/
/*! exports provided: parsePath */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "parsePath", function() { return parsePath; });
/* harmony import */ var qs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! qs */ "qs");
/* harmony import */ var qs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(qs__WEBPACK_IMPORTED_MODULE_0__);


function parseNestedPath(path, params) {
  const re = new RegExp(':([^\\/\\?]+)\\??', 'g');
  let match = null;

  while ((match = re.exec(path)) !== null) {
    if (Object.keys(params.route).includes(match[1])) {
      path = path.replace(match[0], params.route[match[1]]);
    }
  }

  return path;
}

function parsePath(hook, config = {
  removePathFromCacheKey: false,
  parseNestedRoutes: false
}) {
  const q = hook.params.query || {};
  const remove = config.removePathFromCacheKey;
  const parseNestedRoutes = config.parseNestedRoutes;
  let path = remove && hook.id ? '' : `${hook.path}`;

  if (!remove && parseNestedRoutes) {
    path = parseNestedPath(path, hook.params);
  }

  if (hook.id) {
    if (path.length !== 0 && !remove) {
      path += '/';
    }

    if (Object.keys(q).length > 0) {
      path += `${hook.id}?${qs__WEBPACK_IMPORTED_MODULE_0___default.a.stringify(q, {
        encode: false
      })}`;
    } else {
      path += `${hook.id}`;
    }
  } else {
    if (Object.keys(q).length > 0) {
      path += `?${qs__WEBPACK_IMPORTED_MODULE_0___default.a.stringify(q, {
        encode: false
      })}`;
    }
  }

  return path;
}



/***/ }),

/***/ "./src/hooks/redis.js":
/*!****************************!*\
  !*** ./src/hooks/redis.js ***!
  \****************************/
/*! exports provided: before, after */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "before", function() { return before; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "after", function() { return after; });
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! moment */ "moment");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var chalk__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! chalk */ "chalk");
/* harmony import */ var chalk__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(chalk__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _helpers_path__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./helpers/path */ "./src/hooks/helpers/path.js");
/* harmony import */ var debug__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! debug */ "debug");
/* harmony import */ var debug__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(debug__WEBPACK_IMPORTED_MODULE_3__);




const debug = debug__WEBPACK_IMPORTED_MODULE_3___default()('feathers-hooks-rediscache:redis');
const defaults = {
  env: 'production',
  defaultDuration: 3600 * 24,
  immediateCacheKey: false,
  extendDuration: 0
};
function before(options) {
  // eslint-disable-line no-unused-vars
  return function (hook) {
    const cacheOptions = hook.app.get('redisCache');
    options = Object.assign({}, defaults, cacheOptions, options);
    return new Promise(resolve => {
      const extendDuration = options.extendDuration || options.extendDuration;
      const client = hook.app.get('redisClient');

      if (!client) {
        resolve(hook);
      }

      const path = Object(_helpers_path__WEBPACK_IMPORTED_MODULE_2__["parsePath"])(hook, options);

      const callback = (err, reply) => {
        if (err !== null) resolve(hook);

        if (reply) {
          let data = JSON.parse(reply);
          const duration = moment__WEBPACK_IMPORTED_MODULE_0___default()(data.cache.expiresOn).format('DD MMMM YYYY - HH:mm:ss');
          hook.result = data;
          resolve(hook);
          /* istanbul ignore next */

          if (options.env !== 'test') {
            debug(`${chalk__WEBPACK_IMPORTED_MODULE_1___default.a.cyan('[redis]')} returning cached value for ${chalk__WEBPACK_IMPORTED_MODULE_1___default.a.green(path)}.`);
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
        client.multi().get(path, callback).expire(path, extendDuration).exec();
      } else {
        client.get(path, callback);
      }
    });
  };
}
;
function after(options) {
  // eslint-disable-line no-unused-vars
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

        const path = hook.params.cacheKey || Object(_helpers_path__WEBPACK_IMPORTED_MODULE_2__["parsePath"])(hook, options); // adding a cache object

        Object.assign(hook.result.cache, {
          cached: true,
          duration: duration,
          expiresOn: moment__WEBPACK_IMPORTED_MODULE_0___default()().add(moment__WEBPACK_IMPORTED_MODULE_0___default.a.duration(duration, 'seconds')),
          parent: hook.path,
          group: hook.path ? `group-${hook.path}` : '',
          key: path
        });
        client.set(path, JSON.stringify(hook.result));
        client.expire(path, hook.result.cache.duration);

        if (hook.path) {
          client.rpush(hook.result.cache.group, path);
        }
        /* istanbul ignore next */


        if (options.env !== 'test') {
          debug(`${chalk__WEBPACK_IMPORTED_MODULE_1___default.a.cyan('[redis]')} added ${chalk__WEBPACK_IMPORTED_MODULE_1___default.a.green(path)} to the cache.`);
          debug(`> Expires in ${moment__WEBPACK_IMPORTED_MODULE_0___default.a.duration(duration, 'seconds').humanize()}.`);
        }
      }

      if (hook.result.cache.hasOwnProperty('wrapped')) {
        const {
          wrapped
        } = hook.result.cache;
        hook.result = wrapped;
      }

      resolve(hook);
    });
  };
}
;

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! exports provided: redisClient, cacheRoutes, hookCache, hookRemoveCacheInformation, redisBeforeHook, redisAfterHook */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _routes_cache__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./routes/cache */ "./src/routes/cache.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "cacheRoutes", function() { return _routes_cache__WEBPACK_IMPORTED_MODULE_0__["default"]; });

/* harmony import */ var _redisClient__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./redisClient */ "./src/redisClient.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "redisClient", function() { return _redisClient__WEBPACK_IMPORTED_MODULE_1__["default"]; });

/* harmony import */ var _hooks_cache__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./hooks/cache */ "./src/hooks/cache.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "hookCache", function() { return _hooks_cache__WEBPACK_IMPORTED_MODULE_2__["cache"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "hookRemoveCacheInformation", function() { return _hooks_cache__WEBPACK_IMPORTED_MODULE_2__["removeCacheInformation"]; });

/* harmony import */ var _hooks_redis__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./hooks/redis */ "./src/hooks/redis.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "redisBeforeHook", function() { return _hooks_redis__WEBPACK_IMPORTED_MODULE_3__["before"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "redisAfterHook", function() { return _hooks_redis__WEBPACK_IMPORTED_MODULE_3__["after"]; });









/***/ }),

/***/ "./src/redisClient.js":
/*!****************************!*\
  !*** ./src/redisClient.js ***!
  \****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return redisClient; });
/* harmony import */ var redis__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! redis */ "redis");
/* harmony import */ var redis__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(redis__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var chalk__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! chalk */ "chalk");
/* harmony import */ var chalk__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(chalk__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var debug__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! debug */ "debug");
/* harmony import */ var debug__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(debug__WEBPACK_IMPORTED_MODULE_2__);



const debug = debug__WEBPACK_IMPORTED_MODULE_2___default()('feathers-hooks-rediscache:redisClient');
function redisClient() {
  // eslint-disable-line no-unused-vars
  const app = this;
  const cacheOptions = app.get('redisCache') || {};
  const retryInterval = cacheOptions.retryInterval || 10000;
  const redisOptions = Object.assign({}, this.get('redis'), {
    retry_strategy: function (options) {
      // eslint-disable-line camelcase
      app.set('redisClient', undefined);
      /* istanbul ignore next */

      if (cacheOptions.env !== 'test') {
        debug(`${chalk__WEBPACK_IMPORTED_MODULE_1___default.a.yellow('[redis]')} not connected`);
      }

      return retryInterval;
    }
  });
  const client = redis__WEBPACK_IMPORTED_MODULE_0___default.a.createClient(redisOptions);
  app.set('redisClient', client);
  client.on('ready', () => {
    app.set('redisClient', client);
    /* istanbul ignore next */

    if (cacheOptions.env !== 'test') {
      debug(`${chalk__WEBPACK_IMPORTED_MODULE_1___default.a.green('[redis]')} connected`);
    }
  });
  return this;
}

/***/ }),

/***/ "./src/routes/cache.js":
/*!*****************************!*\
  !*** ./src/routes/cache.js ***!
  \*****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! express */ "express");
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _helpers_redis__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./helpers/redis */ "./src/routes/helpers/redis.js");


const HTTP_OK = 200;
const HTTP_NO_CONTENT = 204;
const HTTP_SERVER_ERROR = 500;
const HTTP_NOT_FOUND = 404;

function routes(app) {
  const router = express__WEBPACK_IMPORTED_MODULE_0___default.a.Router();
  const client = app.get('redisClient');
  const h = new _helpers_redis__WEBPACK_IMPORTED_MODULE_1__["default"](client);
  router.get('/clear', (req, res) => {
    client.flushall('ASYNC', () => {
      res.status(HTTP_OK).json({
        message: 'Cache cleared',
        status: HTTP_OK
      });
    });
  }); // clear a unique route
  // clear a unique route

  router.get('/clear/single/*', (req, res) => {
    let target = decodeURIComponent(req.params[0]); // Formated options following ?

    const query = req.query;
    const hasQueryString = query && Object.keys(query).length !== 0; // Target should always be defined as Express router raises 404
    // as route is not handled

    if (target.length) {
      if (hasQueryString) {
        // Keep queries in a single string with the taget
        target = decodeURIComponent(req.url.split('/').slice(3).join('/'));
      } // Gets the value of a key in the redis client


      client.get(`${target}`, (err, reply) => {
        if (err) {
          res.status(HTTP_SERVER_ERROR).json({
            message: 'something went wrong' + err.message
          });
        } else {
          // If the key existed
          if (reply) {
            // Clear existing cached key
            h.clearSingle(target).then(r => {
              res.status(HTTP_OK).json({
                message: `cache cleared for key (${hasQueryString ? 'with' : 'without'} params): ${target}`,
                status: HTTP_OK
              });
            });
          } else {
            /**
             * Empty reply means the key does not exist.
             * Must use HTTP_OK with express as HTTP's RFC stats 204 should not
             * provide a body, message would then be lost.
             */
            res.status(HTTP_OK).json({
              message: `cache already cleared for key (${hasQueryString ? 'with' : 'without'} params): ${target}`,
              status: HTTP_NO_CONTENT
            });
          }
        }
      });
    } else {
      res.status(HTTP_NOT_FOUND).end();
    }
  }); // clear a group

  router.get('/clear/group/*', (req, res) => {
    let target = decodeURIComponent(req.params[0]); // Target should always be defined as Express router raises 404
    // as route is not handled

    if (target.length) {
      target = 'group-' + target; // Returns elements of the list associated to the target/key 0 being the
      // first and -1 specifying get all till the latest

      client.lrange(target, 0, -1, (err, reply) => {
        if (err) {
          res.status(HTTP_SERVER_ERROR).json({
            message: 'something went wrong' + err.message
          });
        } else {
          // If the list/group existed and contains something
          if (reply && Array.isArray(reply) && reply.length > 0) {
            // Clear existing cached group key
            h.clearGroup(target).then(r => {
              res.status(HTTP_OK).json({
                message: `cache cleared for the group key: ${decodeURIComponent(req.params[0])}`,
                status: HTTP_OK
              });
            });
          } else {
            /**
             * Empty reply means the key does not exist.
             * Must use HTTP_OK with express as HTTP's RFC stats 204 should not
             * provide a body, message would then be lost.
             */
            res.status(HTTP_OK).json({
              message: `cache already cleared for the group key: ${decodeURIComponent(req.params[0])}`,
              status: HTTP_NO_CONTENT
            });
          }
        }
      });
    } else {
      res.status(HTTP_NOT_FOUND).end();
    }
  }); // add route to display cache index
  // this has been removed for performance issues
  // router.get('/index', (req, res) => {
  //   let results = new Set();
  //   h.scanAsync('0', '*', results)
  //     .then(data => {
  //       res.status(200).json(data);
  //     })
  //     .catch(err => {
  //       res.status(404).json(err);
  //     });
  // });

  return router;
}

/* harmony default export */ __webpack_exports__["default"] = (routes);

/***/ }),

/***/ "./src/routes/helpers/redis.js":
/*!*************************************!*\
  !*** ./src/routes/helpers/redis.js ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return RedisCache; });
class RedisCache {
  constructor(client) {
    this.client = client;
  }
  /**
   * scan the redis index
   */
  // scan() {
  //   // starts at 0 if cursor is again 0 it means the iteration is finished
  //   let cursor = '0';
  //   return new Promise((resolve, reject) => {
  //     this.client.scan(cursor, 'MATCH', '*', 'COUNT', '100', (err, reply) => {
  //       if (err) {
  //         reject(err);
  //       }
  //       cursor = reply[0];
  //       if (cursor === '0') {
  //         resolve(reply[1]);
  //       } else {
  //         // do your processing
  //         // reply[1] is an array of matched keys.
  //         // console.log(reply[1]);
  //         return this.scan();
  //       }
  //       return false;
  //     });
  //   });
  // }

  /**
   * Async scan of the redis index
   * Do not for get to passin a Set
   * myResults = new Set();
   *
   * scanAsync('0', "NOC-*[^listen]*", myResults).map(
   *   myResults => { console.log( myResults); }
   * );
   *
   * @param {String} cursor - string '0'
   * @param {String} patern - string '0'
   * @param {Set} returnSet - pass a set to have unique keys
   */
  // scanAsync(cursor, pattern, returnSet) {
  //   // starts at 0 if cursor is again 0 it means the iteration is finished
  //   return new Promise((resolve, reject) => {
  //     this.client.scan(cursor, 'MATCH', pattern, 'COUNT', '100', (err, reply) => {
  //       if (err) {
  //         reject(err);
  //       }
  //       cursor = reply[0];
  //       const keys = reply[1];
  //       keys.forEach((key, i) => {
  //         returnSet.add(key);
  //       });
  //       if (cursor === '0') {
  //         resolve(Array.from(returnSet));
  //       }
  //       return this.scanAsync(cursor, pattern, returnSet);
  //     });
  //   });
  // }

  /**
   * Clean single item from the cache
   * @param {string} key - the key to find in redis
   */


  clearSingle(key) {
    return new Promise((resolve, reject) => {
      this.client.del(`${key}`, (err, reply) => {
        if (err) reject(false);

        if (reply === 1) {
          resolve(true);
        }

        resolve(false);
      });
    });
  }
  /**
   * Clear a group
   * @param {string} key - key of the group to clean
   */


  clearGroup(key) {
    return new Promise((resolve, reject) => {
      this.client.lrange(key, 0, -1, (err, reply) => {
        if (err) {
          reject(err);
        }

        this.clearAll(reply).then(this.client.del(key, (e, r) => {
          resolve(r === 1);
        }));
      });
    });
  }
  /**
   * Clear all keys of a redis list
   * @param {Object[]} array
   */


  clearAll(array) {
    return new Promise(resolve => {
      if (!array.length) resolve(false);
      let i = 0;

      for (i; i < array.length; i++) {
        this.clearSingle(array[i]).then(r => {
          if (i === array.length - 1) {
            resolve(r);
          }
        });
      }
    });
  }

}
;

/***/ }),

/***/ "chalk":
/*!************************!*\
  !*** external "chalk" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("chalk");

/***/ }),

/***/ "debug":
/*!************************!*\
  !*** external "debug" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("debug");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),

/***/ "moment":
/*!*************************!*\
  !*** external "moment" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("moment");

/***/ }),

/***/ "qs":
/*!*********************!*\
  !*** external "qs" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("qs");

/***/ }),

/***/ "redis":
/*!************************!*\
  !*** external "redis" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("redis");

/***/ })

/******/ });
});
//# sourceMappingURL=library.js.map