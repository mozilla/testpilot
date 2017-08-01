/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/* global Components, Services */

const { utils: Cu } = Components;
Cu.import('resource://gre/modules/Services.jsm');

let resolveAppStartup;
export const startupPromise = new Promise(resolve => {
  resolveAppStartup = resolve;
});

export function startupDone() {
  resolveAppStartup();
}

export const startupObserver = {
  register() {
    Services.obs.addObserver(this, 'sessionstore-windows-restored', false);
  },
  unregister() {
    Services.obs.removeObserver(this, 'sessionstore-windows-restored', false);
  },
  observe() {
    startupDone();
    this.unregister();
  }
};
