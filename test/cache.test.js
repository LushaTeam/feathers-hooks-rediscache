import { expect } from 'chai';
import { hookCache } from '../src';

const app = {
  get: () => ({})
};

describe('Cache Hook', () => {
  it('adds a cache object', () => {
    const hook = hookCache();
    const mock = {
      app: app,
      params: { query: ''},
      path: 'test-route',
      result: {
        _sys: {
          status: 200
        },
        cache: {
          cached: true,
          duration: 86400
        }
      }
    };

    return hook(mock).then(result => {
      const data = result.result;

      expect(data.cache.cached).to.equal(true);
      expect(data.cache.duration).to.equal(86400);
    });
  });

  it('does not modify the existing cache object', () => {
    const hook = hookCache();
    const mock = {
      app: app,
      params: { query: ''},
      path: 'test-route',
      result: {
        _sys: {
          status: 200
        }
      }
    };

    return hook(mock).then(result => {
      const data = result.result;

      expect(data.cache.cached).to.equal(false);
      expect(data.cache.duration).to.equal(86400);
      expect(data.cache).to.not.have.property('parent');
      expect(data.cache).to.not.have.property('group');
      expect(data.cache).to.not.have.property('expiresOn');
    });
  });

  it('wraps arrays', () => {
    const hook = hookCache();
    const mock = {
      app: app,
      params: { query: ''},
      path: 'test-route-array',
      result: [
        {title: 'title 1'},
        {title: 'title 2'}
      ]
    };

    return hook(mock).then(result => {
      const data = result.result;

      expect(data.cache.wrapped).to.be.an('array').that.deep.equals([
        {title: 'title 1'},
        {title: 'title 2'}
      ]);
      expect(data.cache.cached).to.equal(false);
      expect(data.cache.duration).to.equal(86400);
      expect(data.cache).to.not.have.property('parent');
      expect(data.cache).to.not.have.property('group');
      expect(data.cache).to.not.have.property('expiresOn');
    });
  });
});
