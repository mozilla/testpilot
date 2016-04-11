import es6Promise from 'es6-promise';
es6Promise.polyfill();

import 'isomorphic-fetch';

// TODO: Switch back to L20N official release when Bug 1240192 is resolved
// https://bugzilla.mozilla.org/show_bug.cgi?id=1240192
import '../vendor/l20n';

import app from 'ampersand-app';

import webChannel from './lib/web-channel';
import ExperimentsCollection from './collections/experiments';
import Me from './models/me';
import PageManager from './lib/page-manager';
import Router from './lib/router';
import domReady from 'domready';

/* global ga*/

app.extend({
  router: new Router(),

  initialize() {
    app.webChannel = webChannel;
    app.me = new Me();
    app.experiments = new ExperimentsCollection();

    Promise.all([
      app.me.fetch(),
      app.experiments.fetch(),
      document.l10n.ready
    ]).then(() => {
      app.me.updateEnabledExperiments(app.experiments);

      app.pageManager = new PageManager({
        pageContainer: document.querySelector('[data-hook=page-container]')
      });

      if (!app.router.history.started()) {
        app.router.history.start();
        // HACK for Issue #124 - sometimes popstate doesn't fire on navigation,
        // but pageshow does. But, we just want to know if the URL changed.
        addEventListener('pageshow', app.router.history.checkUrl, false);
      }
    }).catch((err) => {
      // for now, log the error in the console & do nothing in the UI
      console && console.error(err); // eslint-disable-line no-console
    });
  },

  // Send webChannel message to addon, use a Promise to wait for the answer.
  waitForMessage(type, data, timeout = 1000) {
    return new Promise((resolve, reject) => {
      const rejectTimer = setTimeout(reject, timeout);
      this.once('webChannel:' + type + '-result', (result) => {
        clearTimeout(rejectTimer);
        resolve(result);
      });
      this.webChannel.sendMessage(type, data);
    });
  },

  // Send to GA
  sendToGA(type, data) {
    if (typeof(ga) !== 'undefined') {
      data.hitType = type;
      if (data.outboundURL) {
        data.hitCallback = () => document.location = data.outboundURL;
      }
      ga('send', data);
    }
  }

});

domReady(app.initialize);

// make app accessible from window for debuggin'
window.app = app;
