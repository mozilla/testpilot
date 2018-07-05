// Global setup for all tests

var Enzyme = require("enzyme");
var Adapter = require("enzyme-adapter-react-16");

Enzyme.configure({ adapter: new Adapter() });

// HACK: Ignore non-JS imports used for asset dependencies in Webpack
require.extensions[".scss"] = function() {};
require.extensions[".svg"] = () => "";
require.extensions[".png"] = () => "";
require.extensions[".jpg"] = () => "";

// We need jsdom for enzyme mount()'ed components - mainly the sticky header
// scroll handler stuff on the experiments page.

// see also: https://github.com/airbnb/enzyme/blob/master/docs/guides/jsdom.md#using-enzyme-with-jsdom
// see also: https://github.com/lelandrichardson/enzyme-example-mocha/blob/master/test/.setup.js
var JSDOM = require("jsdom").JSDOM;

var exposedProperties = ["window", "navigator", "document"];

var dom = new JSDOM("");
global.window = dom.window;
global.document = dom.window.document;
global.window.location.protocol = "https:";
global.window.location.host = "testpilot.firefox.com";
Object.keys(dom.window).forEach((property) => {
  if (typeof global[property] === "undefined") {
    exposedProperties.push(property);
    global[property] = dom.window[property];
  }
});
Object.keys(dom.window._core).forEach((property) => {
  if (typeof global[property] === "undefined") {
    exposedProperties.push(property);
    global[property] = dom.window._core[property];
  }
});

global.navigator = {
  userAgent: "node.js"
};
