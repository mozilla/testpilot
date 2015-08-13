var Promise = require("bluebird");
var App = require('ampersand-app');
/*
var AppModel = require('./js/models/App');
var AppView = require('./js/views/App');
var AppRouter = require('./js/Router');
var StartupView = require('./js/views/Startup');
*/

module.exports = App.extend({

  initialize: function () {

    console.log("HELLO WORLD!");

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
