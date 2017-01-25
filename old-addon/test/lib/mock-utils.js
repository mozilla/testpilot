const { Loader, Require, unload,
        override, descriptor } = require('toolkit/loader');
const { ensure } = require('sdk/system/unload');

let debug = false;

exports.setDebug = (flag) => debug = flag;

exports.callback = function(name) {
  let callState = [];
  let implementCb = null;

  const fn = function() {
    const args = Array.prototype.slice.call(arguments);
    args.timestamp = Date.now();
    if (debug) {
      console.log(name, args);  // eslint-disable-line no-console
    }
    callState.push(args);
    if (implementCb) {
      return implementCb.apply(fn, args);
    }
  };

  fn.reset = () => {
    callState = [];
    implementCb = null;
  };
  fn.calls = () => callState;
  fn.implement = cb => implementCb = cb;

  return fn;
};

exports.callbacks = function(spec) {
  const out = {};
  Object.keys(spec).forEach(prefix => {
    out[prefix] = {};
    spec[prefix].forEach(name => {
      out[prefix][name] = exports.callback(prefix + '.' + name);
    });
  });
  return out;
};

exports.resetCallbacks = function(callbacks) {
  Object.keys(callbacks).forEach(prefix => {
    const items = callbacks[prefix];
    Object.keys(items).forEach(name => items[name].reset());
  });
};

// Build a custom module loader that substitutes mock modules for the test
// subject's require() calls.
exports.loader = function(testModule, subjectPath, modules) {
  const loaderOptions = require('@loader/options');

  // Get a handle on the original resolver created by default in Loader.
  const realResolve = loaderOptions.isNative ?
      (id, requirer) => Loader.nodeResolve(id, requirer, {rootURI: loaderOptions.rootURI}) :
      Loader.resolve;

  // Custom resolver that substitutes mock modules, but only when the test
  // subject module is asking for them.
  const mockResolve = (id, requirer) => {
    let resolvedPath = realResolve(id, requirer);
    // Only trigger mock module substitution for the test subject
    if (requirer === subjectPath) {
      // If the real resolver came up with no mapping, use the original ID
      if (!resolvedPath) { resolvedPath = id; }
      // If the path is in our set of mock substitutions, use the prefix.
      if (resolvedPath in modules) {
        resolvedPath = 'mock:' + resolvedPath;
        // Announce the substitution if debug is on.
        if (debug) {
          console.log('Substituting mock', requirer, '<=', id);  // eslint-disable-line no-console
        }
      }
    }
    return resolvedPath;
  };

  // Prefix all the supplied mock modules for conditional injection
  const mockModules = {};
  Object.keys(modules).forEach(path => {
    mockModules['mock:' + path] = modules[path];
  });

  // Build and return the mock module loader
  const loader = Loader(override(  // eslint-disable-line new-cap
    loaderOptions,
    {modules: mockModules, resolve: mockResolve}
  ));

  const mockLoader = Object.create(loader, descriptor({
    require: Require(loader, testModule),  // eslint-disable-line new-cap
    unload: reason => unload(loader, reason)
  }));

  ensure(mockLoader);

  return mockLoader;
};
