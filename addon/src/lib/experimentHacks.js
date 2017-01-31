/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

// @flow

import PrefsService from 'sdk/preferences/service';
import { storage } from 'sdk/simple-storage';

const BLOK_ID = 'blok@mozilla.org';
const TP_PREFS = {
  'privacy.trackingprotection.enabled': false,
  'privacy.trackingprotection.pbmode.enabled': true,
  'services.sync.prefs.sync.privacy.trackingprotection.enabled': false,
  'services.sync.prefs.sync.privacy.trackingprotection.pbmode.enabled': false
};

export function enabled(id: string) {
  if (id !== BLOK_ID) {
    return;
  }
  const prefnames = Object.keys(TP_PREFS);
  if (!storage.tpPrefs) {
    storage.tpPrefs = prefnames.map(name => [ name, PrefsService.get(name) ]);
  }
  prefnames.forEach(name => {
    PrefsService.set(name, TP_PREFS[name]);
  });
}

export function disabled(id: string) {
  if (id !== BLOK_ID) {
    return;
  }
  if (storage.tpPrefs) {
    storage.tpPrefs.forEach(pair => {
      PrefsService.set(pair[0], pair[1]);
    });
    delete storage.tpPrefs;
  }
}
