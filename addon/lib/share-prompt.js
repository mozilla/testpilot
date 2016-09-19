 /*
  * This Source Code is subject to the terms of the Mozilla Public License
  * version 2.0 (the 'License'). You can obtain a copy of the License at
  * http://mozilla.org/MPL/2.0/.
  */

const store = require('sdk/simple-storage').storage;
const tabs = require('sdk/tabs');

let SETTINGS;


module.exports = {
  DELAY: 3 * 24 * 60 * 60 * 1000,  // 3 days
  LOCAL_DELAY: 1000,  // 1 second
  PATH: 'share',
  QS: 'utm_source=testpilot-addon&utm_medium=firefox-browser&utm_campaign=share-page',

  makeUrl: function() {
    return `${SETTINGS.BASE_URL}/${this.path}?${this.qs}`;
  },

  hasExperimentInstalled: function() {
    try {
      return Object.keys(store.installedAddons).length > 0;
    } catch (err) {
      return false;
    }
  },

  openShareTab: function() {
    tabs.open({
      url: this.makeUrl()
    });
  },

  calculateDelay: function() {
    return SETTINGS.env === 'local' ? this.LOCAL_DELAY : this.DELAY;
  },

  shouldOpenTab: function() {
    return (
      store.sharePrompt.hasBeenShown === false &&
      store.sharePrompt.showAt &&
      store.sharePrompt.showAt <= Date.now()
    );
  },

  setup: function() {
    if (typeof store.sharePrompt === 'undefined') {
      store.sharePrompt = {
        showAt: 0,
        hasBeenShown: false
      };
    }
    if (this.hasExperimentInstalled() && !store.sharePrompt.showAt) {
      store.sharePrompt.showAt = Date.now() + this.calculateDelay();
    }
  },

  destroy: function(reason) {
    if (reason === 'uninstall') {
      delete store.sharePrompt;
    }
  },

  init: function(settings) {
    SETTINGS = settings;
    this.setup();
    if (this.shouldOpenTab()) {
      this.openShareTab();
      store.sharePrompt.hasBeenShown = true;
    }
  }
};
