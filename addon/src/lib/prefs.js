/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/* global Components, Services */
import PubSub from 'pubsub-js';

import allTopics from './topics';
import { log } from './utils';
import { sendToWebextension } from './webExtension';

const { utils: Cu } = Components;
Cu.import('resource://gre/modules/Services.jsm');

const bootstrapTopics = (...args) => allTopics('bootstrap', ...args);
const prefsTopics = (...args) => bootstrapTopics('prefs', ...args);
const webExtensionTopics = (...args) =>
  bootstrapTopics('webExtension', ...args);

const PREF_BRANCH = 'testpilot.';
const ENV_PREF = 'testpilot.env';

const prefObserver = {
  register() {
    Services.prefs.addObserver(PREF_BRANCH, this, false);
  },
  unregister() {
    Services.prefs.removeObserver(PREF_BRANCH, this, false);
  },
  observe(aSubject, aTopic, aData) {
    const message = {};
    message[aData] = Services.prefs.getCharPref(aData);
    sendToWebextension(prefsTopics('prefsChange'), message);
  }
};

export async function startupPrefsObserver() {
  log('startupPrefsObserver');
  prefObserver.register();
  PubSub.subscribe(webExtensionTopics('portConnected'), (_, { port }) =>
    sendInitialPrefs(port)
  );
}

export function shutdownPrefsObserver() {
  prefObserver.unregister();
}

function sendInitialPrefs(port) {
  const message = {};
  message[ENV_PREF] = Services.prefs.getCharPref(ENV_PREF);
  port.postMessage({ op: prefsTopics('prefsChange'), message });
}
