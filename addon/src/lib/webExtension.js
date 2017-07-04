/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/* global Components, Services, LegacyExtensionsUtils */

import PubSub from 'pubsub-js';
import allTopics from './topics';

import { log, addonMetadata } from './utils';

const { utils: Cu } = Components;
Cu.import('resource://gre/modules/Services.jsm');
Cu.import('resource://gre/modules/LegacyExtensionsUtils.jsm');

const bootstrapTopics = (...args) => allTopics('bootstrap', ...args);
const webExtensionTopics = (...args) =>
  bootstrapTopics('webExtension', ...args);
const webExtensionAPITopics = (...args) =>
  bootstrapTopics('webExtensionAPI', ...args);

const ports = [];

export async function startupWebExtension(data, reason) {
  log('startupWebExtension');

  const webExtension = LegacyExtensionsUtils.getEmbeddedExtensionFor({
    id: data.id,
    resourceURI: data.resourceURI
  });
  const { browser } = await webExtension.startup(reason);

  // Open bootstrap-to-webextension port on connect
  browser.runtime.onConnect.addListener(port => {
    ports.push(port);
    PubSub.publishSync(webExtensionTopics('portConnected'), { port });
  });

  // Relay topics from bootstrap to WebExtension over the ports
  ['events', 'channels', 'addonManager'].forEach(name =>
    PubSub.subscribe(bootstrapTopics(name), sendToWebextension)
  );

  // Relay topics from webextension-to-bootstrap messages
  browser.runtime.onMessage.addListener(
    ({ op, message }, sender, sendReply) => {
      PubSub.publishSync(op, { sendReply, message, sender });
    }
  );

  // TODO: Move this to a different module?
  registerWebExtensionAPI('getAddonMetadata', () => addonMetadata);

  // TODO: Move this to a different UI-centric module?
  registerWebExtensionAPI('clickBrowserAction', () => clickBrowserAction());

  // Return a promise that resolves when the WebExtension signals ready
  return new Promise(resolve => {
    const token = PubSub.subscribe(webExtensionAPITopics('ready'), () => {
      PubSub.unsubscribe(token);
      resolve();
    });
  });
}

export function shutdownWebExtension(data, reason) {
  log('shutdownWebExtension');
  const webExtension = LegacyExtensionsUtils.getEmbeddedExtensionFor({
    id: data.id,
    resourceURI: data.resourceURI
  });
  if (webExtension.started) {
    webExtension.shutdown(reason);
  }
}

export function registerWebExtensionAPI(op, handler) {
  PubSub.subscribe(
    webExtensionAPITopics(op),
    (topic, { sendReply, message, sender }) =>
      sendReply(handler(message, sender))
  );
}

export function sendToWebextension(op, message) {
  ports.forEach(port => port.postMessage({ op, message }));
}

// TODO: Remove this? Experiment in summoning the pop-up for surveys
const BROWSER_ACTION_BUTTON_ID = '_testpilot-addon-browser-action';
function clickBrowserAction(sendReply) {
  const win = Services.wm.getMostRecentWindow('navigator:browser');
  const button = win.document.getElementById(BROWSER_ACTION_BUTTON_ID);
  if (button) button.click();
  return sendReply();
}
