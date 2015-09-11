import app from 'ampersand-app';

import webChannel from './lib/web-channel';
import ExperimentsCollection from './collections/experiments';
import HeaderView from './views/header-view';
import Me from './models/me';
import PageManager from './lib/page-manager';
import Router from './lib/router';

app.extend({
  initialize() {
    // for now, instantiate the collection with dummy data
    app.experiments = new ExperimentsCollection([
      {
        displayName: 'Universal Search',
        name: 'universal-search',
        isInstalled: false
      }, {
        displayName: 'Side Tabs',
        name: 'side-tabs',
        isInstalled: false
      }, {
        displayName: 'Snooze Tabs',
        name: 'snooze-tabs',
        isInstalled: false
      }, {
        displayName: 'Cheese Tabs',
        name: 'cheese-tabs',
        isInstalled: false
      }
    ]);
    app.webChannel = webChannel;
    app.me = new Me();

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
  }
});
app.initialize();


// make app accessible from window for debuggin'
window.app = app;
