/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

const store = require('sdk/simple-storage').storage;
const tabs = require('sdk/tabs');


module.exports = {
  utm: 'utm_source=testpilot-addon&utm_medium=firefox-browser&utm_campaign=restart-required',

  setup: function(reason, settings) {
    this.check(tabs, settings);
  },

  check(tabList, settings) {
    if (this.isFirstRun()) {
      if (!this.isTestPilotOpen(tabList, settings)) {
        this.openTestPilot(settings);
      }
      store.firstRun = true;
    }
  },

  isFirstRun() {
    return typeof store.firstRun === 'undefined';
  },

  isTestPilotOpen(tabList, settings) {
    for (let tab of tabList) { // eslint-disable-line prefer-const
      if (tab.url.startsWith(settings.BASE_URL)) {
        return true;
      }
    }
    return false;
  },

  openTestPilot(settings) {
    tabs.open({
      url: `${settings.BASE_URL}?${this.utm}`
    });
  },

  teardown: function(reason) {
    if (reason === 'uninstall') {
      delete store.firstRun;
    }
  }
};
