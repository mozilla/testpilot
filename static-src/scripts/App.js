const App = require('ampersand-app');
/*
const AppModel = require('./js/models/App');
const AppView = require('./js/views/App');
const AppRouter = require('./js/Router');
const StartupView = require('./js/views/Startup');
*/

module.exports = App.extend({
  initialize: function appInitialize() {
    console.log('HELLO WORLD!');

    /*
    this.model = new AppModel();
    this.view = new AppView({ model: this.model });
    this.router = new AppRouter();

    this.view.render();
    document.body.appendChild(this.view.el);
    this.trigger('page', new StartupView());

    // Do some start up stuff while startup view displayed
    // Then...

    this.router.history.start({
      pushState: false,
      hashChange: true
    });
    */
  }
});
