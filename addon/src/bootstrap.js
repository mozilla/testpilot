/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import PubSub from "pubsub-js";

import { debug, log, setAddonMetadata } from "./lib/utils";
import { startupPrefsObserver, shutdownPrefsObserver } from "./lib/prefs";
import { startupWebExtension, shutdownWebExtension } from "./lib/webExtension";
import { startupEvents, shutdownEvents } from "./lib/events";
import { startupChannels, shutdownChannels } from "./lib/channels";
import { startupTelemetry, shutdownTelemetry } from "./lib/telemetry";
import { startupAddonManager, shutdownAddonManager } from "./lib/addonManager";

PubSub.immediateExceptions = true;

export function startup(data, reason) {
  setAddonMetadata(data);

  return new Promise().then(setupDebug)
    .then(() => startupTelemetry(data, reason))
    .then(startupAddonManager)
    .then(startupPrefsObserver)
    .then(startupEvents)
    .then(startupChannels)
    .then(() => startupWebExtension(data, reason))
    .catch(err => log("startup error", err));
}

export function shutdown(data, reason) {
  try {
    shutdownWebExtension(data, reason);
    shutdownChannels();
    shutdownEvents();
    shutdownPrefsObserver();
    shutdownAddonManager();
    shutdownTelemetry(data, reason);
    PubSub.clearAllSubscriptions();
  } catch (err) {
    log("shutdown error", err);
  }
}

async function setupDebug() {
  if (!debug) return;
  ["bootstrap", "webExtension"].forEach(root =>
    PubSub.subscribe(root, (message, data) => log("pubsub", message, data))
  );
}
