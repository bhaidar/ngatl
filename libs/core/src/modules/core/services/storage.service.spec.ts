import { TestBed } from '@angular/core/testing';
// app
import { WindowService } from './window.service';
import {
  Cache,
  StorageKeys,
  StorageService,
} from './storage.service';
import { MockWindow } from '../../../testing';

// test module configuration for each test
const testModuleConfig = () => {
  TestBed.configureTestingModule({
    providers : [
      {
        provide : WindowService,
        useClass : MockWindow,
      },
      StorageService,
    ],
  });
};
const resetSpies = function () {
  (<any>console.error).calls.reset();
  (<any>console.log).calls.reset();
};
const aeFn = function () {
  MockWindow.resetCache();
  resetSpies();
};
const cacheError = 'Cache: key or keys must be set.';

describe('core: StorageService', () => {
  let storage: StorageService;
  let spy: any;
  let spyError: any;

  beforeEach(() => {
    testModuleConfig();
    storage = TestBed.get(StorageService);
    spy = spyOn(console, 'log');
    spyError = spyOn(console, 'error');
  });

  afterEach(aeFn);

  it('KEYS', () => {
    expect(Object.keys(StorageKeys).length).toBe(11);
    expect(StorageKeys).toEqual({
      LOCALE: 'ngatl.locale',
      TOKEN : 'ngatl.user-token',
      USER : 'ngatl.current-user',
    });
  });

  it('setItem and getItem', () => {
    storage.setItem('test', { title : 'Test' });
    expect(spy).toHaveBeenCalledWith('test', '{"title":"Test"}');
    const item = storage.getItem('test');
    expect(item).toEqual({ title : 'Test' });
  });

  it('removeItem', () => {
    storage.removeItem('test');
    expect(MockWindow.MEM_CACHE).toEqual({});
  });

  describe('Cache (Base Class)', () => {
    afterEach(aeFn);

    it('setter/getter using default collection cache', () => {
      const c = new Cache(storage);
      expect(c.cache).toBeUndefined();
      // must have key defined to access the cache
      expect(spyError).toHaveBeenCalledWith(cacheError);
      resetSpies();

      // using default collection
      c.key = 'test';
      expect(c.cache).toBeUndefined();
      let value: any = 'a value';
      c.cache = value;
      expect(c.cache).toEqual([value]); // should be a collection by default
      expect(spy).toHaveBeenCalledWith('test', '["a value"]');
      expect(MockWindow.MEM_CACHE).toEqual({ test : '["a value"]' });
      resetSpies();

      value = {
        id : 1,
        name : 'test',
      };
      c.cache = value;
      // won't change since previous value above was a string
      // when setting cache as an object when using default collection type
      // it will attempt to iterate through the collection to either update existing or add new
      // if it comes across a raw string value, it will log an error
      // raw string values should never be persisted - should always be objects in a collection
      expect(c.cache).not.toEqual([value]);
      expect((<any>console.error).calls.argsFor(0)).toEqual(['Cache: invalid value (not an object) in collection.']);
      expect((<any>console.error).calls.argsFor(1)).toEqual(['a value']);
      resetSpies();

      // empty to change cache value types
      c.clear();
      c.cache = value;
      expect(c.cache).toEqual([value]);
      let stringified = JSON.stringify([value]);
      expect((<any>console.log).calls.argsFor(0))
        .toEqual([
          'test',
          stringified,
        ]);
      expect(MockWindow.MEM_CACHE).toEqual({ test : stringified });

      // find by id
      expect(c.findById(1)).toEqual({
        id : 1,
        name : 'test',
      });
      resetSpies();

      // add another value to cache collection
      const newValue: any = {
        id : 2,
        name : 'test 2',
      };
      c.cache = newValue;
      expect(c.cache)
        .toEqual([
          value,
          newValue,
        ]);
      stringified = JSON.stringify([
        value,
        newValue,
      ]);
      expect((<any>console.log).calls.argsFor(0))
        .toEqual([
          'test',
          stringified,
        ]);
      expect(MockWindow.MEM_CACHE).toEqual({ test : stringified });

      // remove that new value
      newValue.clearCache = true;
      c.cache = newValue;
      expect(c.cache).toEqual([value]);
      stringified = JSON.stringify([value]);
      expect((<any>console.log).calls.argsFor(0)).toEqual([
        'test',
        '[{"id":1,"name":"test"},{"id":2,"name":"test 2"}]',
      ]);
      expect(MockWindow.MEM_CACHE).toEqual({ test : stringified });
    });

    it('setter/getter when using multiple keys', () => {
      const c = new Cache(storage);
      expect(c.cache).toBeUndefined();
      // must have key defined to access the cache
      expect(spyError).toHaveBeenCalledWith(cacheError);
      resetSpies();

      // using default collection
      c.keys = [
        'test',
        'test2',
      ];
      expect(c.cache).toBeUndefined();
      expect(c.cacheForKey('test')).toBeUndefined();
      expect(c.cacheForKey('test unknown')).toBeUndefined();
      expect(spyError).toHaveBeenCalledWith(`Cache: 'test unknown' is not part of supported keys.`);
      resetSpies();

      let value: any = 'a value';
      c.cache = value;
      expect(c.cache).toBeUndefined();
      c.cacheKey(c.keys[0], value);
      expect(spy).toHaveBeenCalledWith('test', '["a value"]');
      expect(MockWindow.MEM_CACHE).toEqual({ test : '["a value"]' });
      resetSpies();

      value = {
        id : 1,
        name : 'test',
      };
      c.cache = value;
      // when using multiple keys, it will refuse to set cache since singular key is not set
      expect(c.cache).not.toEqual([value]);
      expect((<any>console.error).calls.argsFor(0)).toEqual(['Cache: key must be set.']);
      expect((<any>console.error).calls.argsFor(1)).toEqual([]);
      resetSpies();

      // empty to change cache value types
      // still can't use cache without singular key
      c.clear();
      c.cache = value;
      expect(c.cache).toBeUndefined();
      let stringified = JSON.stringify([value]);
      expect(<any>console.log).not.toHaveBeenCalled();
      expect(MockWindow.MEM_CACHE).toEqual({});

      // setup valid key
      c.cacheKey(c.keys[0], value);
      // find by id
      expect(c.findById(1, c.keys[0])).toEqual({
        id : 1,
        name : 'test',
      });
      resetSpies();

      // add another value to cache collection
      const newValue: any = {
        id : 2,
        name : 'test 2',
      };
      c.cacheKey(c.keys[0], newValue);
      expect(c.cacheForKey(c.keys[0]))
        .toEqual([
          value,
          newValue,
        ]);
      stringified = JSON.stringify([
        value,
        newValue,
      ]);
      expect((<any>console.log).calls.argsFor(0))
        .toEqual([
          'test',
          stringified,
        ]);
      expect(MockWindow.MEM_CACHE).toEqual({ test : stringified });

      // remove that new value
      newValue.clearCache = true;
      c.cacheKey(c.keys[0], newValue);
      expect(c.cacheForKey(c.keys[0])).toEqual([value]);
      stringified = JSON.stringify([value]);
      expect((<any>console.log).calls.argsFor(0)).toEqual([
        'test',
        '[{"id":1,"name":"test"},{"id":2,"name":"test 2"}]',
      ]);
      expect(MockWindow.MEM_CACHE).toEqual({ test : stringified });
    });

    it('setter/getter using (opt-in) object only cache', () => {
      const c = new Cache(storage);
      c.key = 'object-only';
      c.isObjectCache = true;

      expect(c.cache).toBeUndefined();
      expect(spyError).not.toHaveBeenCalledWith(cacheError);
      let value: any = {
        id : 1,
        name : 'test',
      };
      c.cache = value;
      expect(c.cache).toEqual(value); // should be an object
      expect(spy).toHaveBeenCalledWith('object-only', '{"id":1,"name":"test"}');
      expect(MockWindow.MEM_CACHE).toEqual({ 'object-only' : '{"id":1,"name":"test"}' });
      resetSpies();

      // update properties
      value.name = 'test modified';
      c.cache = value;
      expect(c.cache).toEqual(value); // should be an object
      expect(spy).toHaveBeenCalledWith('object-only', '{"id":1,"name":"test modified"}');
      expect(MockWindow.MEM_CACHE).toEqual({ 'object-only' : '{"id":1,"name":"test modified"}' });
      resetSpies();

      // adding a new value should overwrite the previous value
      value = {
        id : 2,
        name : 'test',
      };
      c.cache = value;
      expect(c.cache).toEqual(value); // should be an object
      expect(spy).toHaveBeenCalledWith('object-only', '{"id":2,"name":"test"}');
      expect(MockWindow.MEM_CACHE).toEqual({ 'object-only' : '{"id":2,"name":"test"}' });
    });

    it('preAddFn', () => {
      const c = new Cache(storage);
      c.key = 'processing';

      // limit cache to only 2 in collection
      c.preAddFn = function (cached: Array<any>) {
        if ( cached.length === 2 ) {
          cached.shift();
        }
      };
      const value: any = {
        id : 1,
        name : 'test',
      };
      c.cache = value;
      expect(c.cache).toEqual([value]); // should be a collection by default
      expect(spy).toHaveBeenCalledWith('processing', '[{"id":1,"name":"test"}]');
      expect(MockWindow.MEM_CACHE).toEqual({ processing : '[{"id":1,"name":"test"}]' });

      const value2: any = {
        id : 2,
        name : 'test 2',
      };
      c.cache = value2;
      expect(c.cache)
        .toEqual([
          value,
          value2,
        ]);
      expect(spy).toHaveBeenCalledWith('processing', '[{"id":1,"name":"test"},{"id":2,"name":"test 2"}]');
      expect(MockWindow.MEM_CACHE).toEqual({ processing : '[{"id":1,"name":"test"},{"id":2,"name":"test 2"}]' });

      const value3: any = {
        id : 3,
        name : 'test 3',
      };
      c.cache = value3;
      expect(c.cache)
        .toEqual([
          value2,
          value3,
        ]);
      expect(spy).toHaveBeenCalledWith('processing', '[{"id":2,"name":"test 2"},{"id":3,"name":"test 3"}]');
      expect(MockWindow.MEM_CACHE).toEqual({ processing : '[{"id":2,"name":"test 2"},{"id":3,"name":"test 3"}]' });
    });
  });
});
