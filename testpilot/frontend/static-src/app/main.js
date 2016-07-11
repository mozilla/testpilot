import 'babel-polyfill/browser';
import 'l20n/dist/compat/web/l20n';

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

/* global ga*/
/*eslint-disable*/
// HACK: Google Analytics lives here, because CSP won't let it live inline
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)
},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
/*eslint-enable*/

if (typeof(ga) !== 'undefined') {
  ga('create', 'UA-49796218-34', 'auto');
} else {
  console.warn( // eslint-disable-line no-console
    'You have google analytics blocked. We understand. Take a ' +
    'look at our privacy policy to see how we handle your data.'
  );
}

app.extend({
  router: new Router(),

  initialize() {
    app.webChannel = webChannel;
    app.me = new Me();
    app.experiments = new ExperimentsCollection();

    Promise.all([
      app.me.fetch(),
      app.experiments.fetch()
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
    const hitCallback = () => {
      if (data.outboundURL) {
        document.location = data.outboundURL;
      }
    };
    if (window.ga && ga.loaded) {
      data.hitType = type;
      data.hitCallback = hitCallback;
      ga('send', data);
    } else {
      hitCallback();
    }
  },

  // Subscribe to basket
  subscribeToBasket(email, callback) {
    const url = 'https://basket.mozilla.org/news/subscribe/';
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'newsletters=test-pilot&email=' + encodeURIComponent(email)
    }).then(callback)
    .catch(err => {
      // for now, log the error in the console & do nothing in the UI
      console && console.error(err); // eslint-disable-line no-console
    });
  }
});

domReady(app.initialize);

// make app accessible from window for debuggin'
window.app = app;
