import app from 'ampersand-app';
import Router from 'ampersand-router';

// publishes the 'router:new-page' event
// packet format: { page, opts }
// - page: string, the name of the requested page
// - opts: object (not array) of variables passed as URL slugs

export default Router.extend({
  routes: {
    '': 'landing',
    'home': 'home',
    'experiments/:experiment': 'experimentDetail',
    '404': 'notFound',
    'error': 'error',
    '(*path)': 'notFound'
  },

  landing() {
    if (app.me.session && app.me.hasAddon) {
      this.redirectTo('home');
    } else {
      app.trigger('router:new-page', {page: 'landing'});
    }
  },

  home() {
    if (!app.me.session || !app.me.hasAddon) {
      this.redirectTo('');
    } else {
      app.trigger('router:new-page', {page: 'home'});
    }
  },

  experimentDetail(experiment) {
    if (!app.me.session || !app.me.hasAddon) {
      this.redirectTo('');
    } else {
      // if the experiment exists, load a detail page; else, 404
      const exp = app.experiments.get(experiment, 'name');
      if (exp) {
        app.trigger('router:new-page', {
          page: 'experimentDetail',
          opts: {
            experiment: exp
          }
        });
      } else {
        this.redirectTo('404');
      }
    }
  },

  notFound() {
    app.trigger('router:new-page', {page: 'notFound'});
  },

  error() {
    app.trigger('router:new-page', {page: 'error'});
  }

});
