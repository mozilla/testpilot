/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/* global Components, Services */

import PubSub from 'pubsub-js';
import allTopics from './topics';

import { log } from './utils';
import { registerWebExtensionAPI } from './webExtension';

const { interfaces: Ci, utils: Cu } = Components;
Cu.import('resource://gre/modules/Services.jsm');
const { getExtensionUUID } = Cu.import('resource://gre/modules/Extension.jsm');

const bootstrapTopics = (...args) => allTopics('bootstrap', ...args);
const channelsTopics = (...args) => bootstrapTopics('channels', ...args);

export const TESTPILOT_TELEMETRY_TOPIC = 'testpilot-telemetry';

const channels = new Map();

export async function startupChannels() {
  log('startupChannels');
  registerWebExtensionAPI('openChannel', ({ addonId, topic }) =>
    openChannel(addonId, topic)
  );
}

export async function shutdownChannels() {
  log('shutdownChannels');
  for (const id of channels.keys()) {
    const [topic, addonId] = id.split(':');
    closeChannel(addonId, topic);
  }
}

export default class WebExtensionChannel {
  constructor(topic, targetAddonId) {
    this.listeners = new Set();
    this.topic = topic;
    this.targetAddonId = targetAddonId;
    this.handleEvent = (event: Object) => {
      if (event.data) {
        this.notify(event.data, this.targetAddonId);
      }
    };

    const {
      addonChromeWebNav,
      addonBroadcastChannel
    } = createChannelForAddonId(topic, targetAddonId);

    // NOTE: Keep a ref to prevent it from going away during garbage collection
    // (or the BroadcastChannel will stop working).
    this.addonChromeWebNav = addonChromeWebNav;
    this.addonBroadcastChannel = addonBroadcastChannel;
    this.addonBroadcastChannel.addEventListener('message', this.handleEvent);
  }

  dispose() {
    this.addonBroadcastChannel.removeEventListener('message', this.handleEvent);
    this.addonBroadcastChannel.close();
    this.addonChromeWebNav.close();
    this.listeners.clear();

    this.addonBroadcastChannel = null;
    this.addonChromeWebNav = null;
  }

  registerListener(callback: Function) {
    this.listeners.add(callback);
  }

  unregisterListener(callback: Function) {
    this.listeners.delete(callback);
  }

  notify(data, sender) {
    // eslint-disable-next-line prefer-const
    for (let listener of this.listeners) {
      try {
        listener(data, sender);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Error executing listener', err);
      }
    }
  }
}

export function openChannel(addonId, topic) {
  log('openChannel', addonId, topic);
  const id = `${topic}:${addonId}`;
  if (channels.get(id)) {
    // Accept an attempt to open an existing channel as an attempt to re-open
    closeChannel(addonId, topic);
  }
  const channel = new WebExtensionChannel(topic, addonId);
  channels.set(id, channel);
  channel.registerListener((payload, subject) =>
    PubSub.publishSync(channelsTopics(topic), {
      subject,
      topic,
      payload
    })
  );
}

export function closeChannel(addonId, topic) {
  log('closeChannel', addonId, topic);
  const id = `${topic}:${addonId}`;
  const c = channels.get(id);
  if (c) {
    c.dispose();
    channels.delete(id);
  }
}

function createChannelForAddonId(name, addonId) {
  // The BroadcastChannel API allows messaging between different windows that
  // share the same origin. Bug 1186732 extended this to WebExtensions (which
  // may not have an origin) by adding a special URL that loads an about:blank
  // page at the (generalized) "origin" of the extension.
  //
  // Load that about:blank page, and use its `window` to get a BroadcastChannel
  // that allows two-way communication between the main Test Pilot extension and
  // individual experiment extensions.
  // Note: the `targetExtensionUUID` is different for each copy of Firefox,
  // so that malicious websites can't guess the special URL associated with
  // an extension.
  const targetExtensionUUID = getExtensionUUID(addonId);

  // Create the special about:blank URL for the extension.
  const baseURI = Services.io.newURI(
    `moz-extension://${targetExtensionUUID}/_blank.html`,
    null,
    null
  );

  // Create a principal (security context) for the generalized origin given
  // by the extension's special URL and its `addonId`.
  const principal = Services.scriptSecurityManager.createCodebasePrincipal(
    baseURI,
    { addonId }
  );

  // Create a hidden window and open the special about:blank page for the
  // extension.
  const addonChromeWebNav = Services.appShell.createWindowlessBrowser(true);
  const docShell = addonChromeWebNav
    // eslint-disable-next-line new-cap
    .QueryInterface(Ci.nsIInterfaceRequestor)
    .getInterface(Ci.nsIDocShell);
  docShell.createAboutBlankContentViewer(principal);
  const window = docShell.contentViewer.DOMDocument.defaultView;

  // Finally, get the BroadcastChannel associated with the extension.
  const addonBroadcastChannel = new window.BroadcastChannel(name);

  // Callers need to keep the pointer to the window, otherwise the window's
  // BroadcastChannel will get garbage collected.
  return { addonChromeWebNav, addonBroadcastChannel };
}
