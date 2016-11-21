 /*
  * This Source Code is subject to the terms of the Mozilla Public License
  * version 2.0 (the 'License'). You can obtain a copy of the License at
  * http://mozilla.org/MPL/2.0/.
  */

const _ = require('sdk/l10n').get;
const notify = require('./notify');
const Metrics = require('./metrics');
const store = require('sdk/simple-storage').storage;
const tabs = require('sdk/tabs');

let SETTINGS;


module.exports = {
  DELAY: 24 * 60 * 60 * 1000,  // 1 day
  QS: 'utm_source=testpilot-addon&utm_medium=firefox-browser&utm_campaign=testpilot-notification&utm_content=no-experiments-installed',

  makeUrl() {
    return `${SETTINGS.BASE_URL}/?${this.QS}`;
  },

  hasNoExperimentsInstalled: function() {
    try {
      return Object.keys(store.installedAddons).length === 0;
    } catch (err) {
      return true;
    }
  },

  shouldShowNotification: function() {
    return (
      this.hasNoExperimentsInstalled() &&
      store.noExperiments.hasBeenShown === false &&
      store.noExperiments.showAt &&
      store.noExperiments.showAt <= Date.now()
    );
  },

  applyCSS: function(notif) {
    if (notif && notif.box) {
      const button = notif.box.getElementsByClassName('notification-button')[0];
      if (button) {
        button.setAttribute('style', 'background: #0095dd; color: #fff; cursor: pointer; height: 30px; font-size: 12px; border-radius: 2px; border: 0px; text-shadow: 0 0px; box-shadow: 0 0px;');
      }
    }
  },

  showNotification: function() {
    const notif = notify.createNotificationBox({
      label: _('no_experiment_message'),
      image: 'resource://@testpilot-addon/data/icon-96.png',
      persistence: -1,
      buttons: [{
        label: _('no_experiment_button'),
        popup: null,
        callback: () => {
          tabs.open({ url: this.makeUrl() });
          Metrics.sendGAEvent({
            t: 'event',
            ec: 'add-on Interactions',
            ea: 'click notification',
            el: 'no experiments installed'
          });
        }
      }]
    });
    this.applyCSS(notif);

    Metrics.sendGAEvent({
      t: 'event',
      ec: 'add-on Interactions',
      ea: 'display notification',
      el: 'no experiments installed'
    });
  },

  setup: function() {
    if (typeof store.noExperiments === 'undefined') {
      store.noExperiments = {
        showAt: null,
        hasBeenShown: false
      };
    }
    if (this.hasNoExperimentsInstalled() && !store.noExperiments.showAt) {
      store.noExperiments.showAt = Date.now() + this.DELAY;
    }
  },

  destroy: function(reason) {
    if (reason === 'uninstall') {
      delete store.noExperiments;
    }
  },

  init: function(settings) {
    SETTINGS = settings;
    this.setup();
    if (this.shouldShowNotification()) {
      this.showNotification();
      store.noExperiments.hasBeenShown = true;
    }
  }
};
