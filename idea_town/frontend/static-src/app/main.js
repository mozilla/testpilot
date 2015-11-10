import es6Promise from 'es6-promise';
es6Promise.polyfill();
import 'isomorphic-fetch';

import app from 'ampersand-app';

import webChannel from './lib/web-channel';
import ExperimentsCollection from './collections/experiments';
import Me from './models/me';
import PageManager from './lib/page-manager';
import Router from './lib/router';
import domReady from 'domready';

app.extend({
  router: new Router(),

  initialize() {
    app.webChannel = webChannel;

    fetch('/api/me?format=json', {
      credentials: 'same-origin'
    }).then((response) => response.json()).then((userData) => {
      app.me = new Me({
        user: userData,
        hasAddon: Boolean(window.navigator.ideatownAddon)
      });

      app.experiments = new ExperimentsCollection();
      app.experiments.fetch({
        success: app.blastOff,
        error: (err) => {
          console && console.error(err); // eslint-disable-line no-console
          app.blastoff();
        }
      });
    }).catch((err) => {
      // for now, log the error in the console & do nothing in the UI
      console && console.error(err); // eslint-disable-line no-console
    });
  },

  blastOff(exp) {
    if (exp && exp.models) {
      app.experiments.set(exp.models);
    }

    app.pageManager = new PageManager({
      pageContainer: document.querySelector('[data-hook=page-container]')
    });

    if (!app.router.history.started()) {
      app.router.history.start();
      // HACK for Issue #124 - sometimes popstate doesn't fire on navigation,
      // but pageshow does. But, we just want to know if the URL changed.
      addEventListener('pageshow', app.router.history.checkUrl, false);
    }

    app.me.on('change:hasAddon', () => {
      app.router.reload();
    });
  }

});

domReady(app.initialize);

// make app accessible from window for debuggin'
window.app = app;
