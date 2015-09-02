import app from 'ampersand-app';
import webChannel from './lib/web_channel';
import ViewSwitcher from 'ampersand-view-switcher';

import ExperimentsCollection from './collections/experiments';
import Me from './models/me';
import HomePage from './views/home_page';
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
    // empty (for now) user model
    // trying out ampersand's 'me' convention, though I find it kinda dumb
    app.me = new Me();

    // ping the addon to see if it's installed
    this.listenTo(webChannel, 'from-addon-to-web', (data) => console.log(data)); // eslint-disable-line no-console
    webChannel.sendMessage('from-web-to-addon', { loaded: true });

    // start with the home page view
    const view = new HomePage({
      experiments: app.experiments
    });

    // start router + history
    app.router = new Router();
    app.router.history.start();

    app.pageContainer = document.querySelector('#container');
    app.viewSwitcher = new ViewSwitcher(app.pageContainer, {
      // do some nice things when you switch to a new page-level view
      // inspired by ampersand-view-switcher readme
      show: function showView(newView) {
        // don't needlessly re-show a shown view
        // works around ampersand-view-switcher bug #26 and seems like a reasonable requirement
        if (newView === app.currentPage) {
          return;
        }
        document.title = view.pageTitle || 'Idea Town';
        document.body.scrollTop = 0;
        app.currentPage = newView;
      }
    });
    app.viewSwitcher.set(view);
    // on page transition, router fires 'newPage' event, which we pass
    // to the ViewSwitcher. nice.
    app.router.on('newPage', function onNewPage(newPage) {
      app.viewSwitcher.set(newPage);
    });
  }
});
app.initialize();

// make app accessible from window for debuggin'
window.app = app;
