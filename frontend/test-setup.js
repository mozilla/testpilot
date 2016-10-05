// Global setup for all tests

// We're going to babelify everything as it loads.
require('babel-register')();

// We need jsdom for enzyme mount()'ed components - mainly the sticky header
// scroll handler stuff on the experiments page.

// see also: https://github.com/airbnb/enzyme/blob/master/docs/guides/jsdom.md#using-enzyme-with-jsdom
// see also: https://github.com/lelandrichardson/enzyme-example-mocha/blob/master/test/.setup.js
var jsdom = require('jsdom').jsdom;

var exposedProperties = ['window', 'navigator', 'document'];

global.document = jsdom('');
global.window = document.defaultView;
Object.keys(document.defaultView).forEach((property) => {
  if (typeof global[property] === 'undefined') {
    exposedProperties.push(property);
    global[property] = document.defaultView[property];
  }
});

global.navigator = {
  userAgent: 'node.js'
};
