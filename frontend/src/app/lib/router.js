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
    'experiments(/)': 'experiments',
    'legacy(/)': 'legacy',
    '404': 'notFound',
    'share(/)': 'share',
    'error': 'error',
    'onboarding': 'onboarding',
    '(*path)': 'notFound'
  },

  landing() {
    if (app.me.hasAddon) {
      this.redirectTo('experiments');
    } else {
      app.trigger('router:new-page', {page: 'landing'});
    }
  },

  experiments() {
    if (!app.me.hasAddon) {
      this.redirectTo('');
    } else {
      app.trigger('router:new-page', {page: 'experiments'});
    }
  },

  // 'experiment' is a URL slug: for example, 'universal-search'
  experimentDetail(experiment) {
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
  },

  home() {
    this.redirectTo('experiments');
  },

  share() {
    app.trigger('router:new-page', {page: 'share'});
  },

  onboarding() {
    app.trigger('router:new-page', {page: 'onboarding'});
  },

  legacy() {
    app.trigger('router:new-page', {page: 'legacy'});
  },

  notFound() {
    app.trigger('router:new-page', {page: 'notFound'});
  },

  error() {
    app.trigger('router:new-page', {page: 'error'});
  }
});
