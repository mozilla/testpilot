/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/* global APP_STARTUP */

import PubSub from 'pubsub-js';

import { debug, log, setAddonMetadata } from './lib/utils';
import { startupDone, startupPromise, startupObserver } from './lib/appStartup';
import { startupLegacyStorage, shutdownLegacyStorage } from './lib/legacyStorage';
import { startupPrefsObserver, shutdownPrefsObserver } from './lib/prefs';
import { startupFrameScripts, shutdownFrameScripts } from './lib/frameScripts';
import { startupWebExtension, shutdownWebExtension } from './lib/webExtension';
import { startupEvents, shutdownEvents } from './lib/events';
import { startupChannels, shutdownChannels } from './lib/channels';
import { startupTelemetry, shutdownTelemetry } from './lib/telemetry';
import { startupAddonManager, shutdownAddonManager } from './lib/addonManager';

PubSub.immediateExceptions = true;

export function startup(data, reason) {
  setAddonMetadata(data);

  if (reason === APP_STARTUP) {
    startupObserver.register();
  } else {
    startupDone();
  }

  return startupPromise
    .then(setupDebug)
    .then(startupLegacyStorage)
    .then(() => startupTelemetry(data, reason))
    .then(startupAddonManager)
    .then(startupPrefsObserver)
    .then(startupEvents)
    .then(startupChannels)
    .then(startupFrameScripts)
    .then(() => startupWebExtension(data, reason))
    .catch(err => log('startup error', err));
}

export function shutdown(data, reason) {
  try {
    shutdownWebExtension(data, reason);
    shutdownFrameScripts();
    shutdownChannels();
    shutdownEvents();
    shutdownPrefsObserver();
    shutdownAddonManager();
    shutdownTelemetry(data, reason);
    shutdownLegacyStorage();
    PubSub.clearAllSubscriptions();
  } catch (err) {
    log('shutdown error', err);
  }
}

async function setupDebug() {
  if (!debug) return;
  ['bootstrap', 'webExtension'].forEach(root =>
    PubSub.subscribe(root, (message, data) => log('pubsub', message, data))
  );
}
