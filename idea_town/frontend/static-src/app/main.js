import es6Promise from 'es6-promise';
es6Promise.polyfill();
import 'isomorphic-fetch';

import app from 'ampersand-app';

import webChannel from './lib/web-channel';
import ExperimentsCollection from './collections/experiments';
import HeaderView from './views/header-view';
import Me from './models/me';
import PageManager from './lib/page-manager';
import Router from './lib/router';

app.extend({

  initialize() {
    app.webChannel = webChannel;

    fetch('/api/me?format=json', {
      credentials: 'same-origin'
    }).then((response) => response.json()).then((userData) => {
      app.me = new Me({
        user: userData
      });

      app.experiments = new ExperimentsCollection();
      app.experiments.fetch();

      // session won't change without a hard refresh, but addon state could, so:
      // if addon state changes, dump user back to '/' and let the router handle
      // redirecting to the correct landing page
      app.me.on('change:hasAddon', () => { app.router.reload(); });

      // the header is independent of the page container logic, so it lives
      // outside the page container element
      // TODO: seems like the PageManager should know when to refresh / hide
      //       the header
      app.headerView = new HeaderView({el: document.querySelector('header') });
      app.headerView.render();

      app.pageManager = new PageManager({
        pageContainer: document.querySelector('[data-hook=page-container]')
      });

      app.router = new Router();
      app.router.history.start();
    }).catch((err) => {
      // for now, log the error in the console & do nothing in the UI
      console && console.error(err); // eslint-disable-line no-console
    });
  }

});
app.initialize();

// make app accessible from window for debuggin'
window.app = app;
