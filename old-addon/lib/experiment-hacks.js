/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

const PrefsService = require('sdk/preferences/service');
const store = require('sdk/simple-storage').storage;

const BLOK_ID = 'blok@mozilla.org';
const TP_PREFS = {
  'privacy.trackingprotection.enabled': false,
  'privacy.trackingprotection.pbmode.enabled': true,
  'services.sync.prefs.sync.privacy.trackingprotection.enabled': false,
  'services.sync.prefs.sync.privacy.trackingprotection.pbmode.enabled': false
};

function enableBlok(id) {
  if (id !== BLOK_ID) { return; }
  const prefnames = Object.keys(TP_PREFS);
  if (!store.tpPrefs) {
    store.tpPrefs = prefnames.map(name => [name, PrefsService.get(name)]);
  }
  prefnames.forEach(name => { PrefsService.set(name, TP_PREFS[name]); });
}

function disableBlok(id) {
  if (id !== BLOK_ID) { return; }
  if (store.tpPrefs) {
    store.tpPrefs.forEach(pair => { PrefsService.set(pair[0], pair[1]); });
    delete store.tpPrefs;
  }
}

module.exports = {
  enabled(id) {
    enableBlok(id);
  },
  disabled(id) {
    disableBlok(id);
  },
  uninstalling(id) {
    disableBlok(id);
  },
  uninstalled(id) {
    disableBlok(id);
  }
};
