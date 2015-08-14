var domready = require('domready');
var App = require('./App');
window.App = App; // HACK: Give access to the app from console
domready(App.initialize.bind(App));
