import app from 'ampersand-app';
import Router from 'ampersand-router';

// publishes the 'router:new-page' event
// packet format: { page, opts }
// - page: string, the name of the requested page
// - opts: object (not array) of variables passed as URL slugs

export default Router.extend({
  routes: {
    '(/)': 'landing',
    'home(/)': 'home',
    'experiments/:experiment(/)': 'experimentDetail',
    'accounts/inactive(/)': 'accountInactive',
    '404': 'notFound',
    'error': 'error',
    '(*path)': 'notFound'
  },

  landing() {
    if (app.me.user.id && app.me.hasAddon) {
      this.redirectTo('home');
    } else {
      app.trigger('router:new-page', {page: 'landing'});
    }
  },

  home() {
    if (!app.me.user.id || !app.me.hasAddon) {
      this.redirectTo('');
    } else {
      app.trigger('router:new-page', {page: 'home'});
    }
  },

  // 'experiment' is a URL slug: for example, 'universal-search'
  experimentDetail(experiment) {
    if (!app.me.user.id || !app.me.hasAddon) {
      this.redirectTo('');
    } else {
      if (app.experiments.get(experiment, 'slug')) {
        app.trigger('router:new-page', {
          page: 'experimentDetail',
          opts: {
            slug: experiment
          }
        });
      } else {
        this.redirectTo('404');
      }
    }
  },

  accountInactive() {
    app.trigger('router:new-page', {page: 'accountInactive'});
  },

  notFound() {
    app.trigger('router:new-page', {page: 'notFound'});
  },

  error() {
    app.trigger('router:new-page', {page: 'error'});
  }
});
