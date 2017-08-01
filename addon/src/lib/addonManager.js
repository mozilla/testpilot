/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/* global Components, Services, AddonManager */

import PubSub from 'pubsub-js';
import allTopics from './topics';

import { log } from './utils';
import { registerWebExtensionAPI } from './webExtension';

const { utils: Cu } = Components;
Cu.import('resource://gre/modules/Services.jsm');
Cu.import('resource://gre/modules/AddonManager.jsm');

const EXTRACTED_ADDON_PROPERTIES = ['id', 'creator', 'name', 'type', 'version'];
const availableAddons = {};
const addonListener = {};

const bootstrapTopics = (...args) => allTopics('bootstrap', ...args);
const addonManagerTopics = (...args) =>
  bootstrapTopics('addonManager', ...args);

['Enabled', 'Disabled', 'Installed', 'Uninstalled'].forEach(event => {
  addonListener[`on${event}`] = rawAddon => {
    const addon = extractAddonDetails(rawAddon);
    if (event === 'Enabled' || event === 'Installed') {
      availableAddons[addon.id] = addon;
    }
    if (event === 'Disabled' || event === 'Uninstalled') {
      delete availableAddons[addon.id];
    }
    const topic = event.toLowerCase();
    PubSub.publishSync(addonManagerTopics(topic), { topic, addon });
  };
});

function extractAddonDetails(addon) {
  const out = {};
  EXTRACTED_ADDON_PROPERTIES.forEach(name => (out[name] = addon[name]));
  return out;
}

export async function startupAddonManager() {
  log('startupAddonManager');

  registerWebExtensionAPI('getAvailableAddons', () => availableAddons);

  AddonManager.addAddonListener(addonListener);

  return new Promise(resolve =>
    AddonManager.getAllAddons(addons => {
      addons
        .filter(addon => addon.isActive)
        .map(extractAddonDetails)
        .forEach(addon => (availableAddons[addon.id] = addon));
      resolve();
    })
  );
}

export async function shutdownAddonManager() {
  log('shutdownAddonManager');
  AddonManager.removeAddonListener(addonListener);
}
