const domready = require('domready');
const App = require('./App');

window.App = App; // HACK: Give access to the app from console
domready(App.initialize.bind(App));
