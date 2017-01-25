/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

/* global XPCOMUtils, Services */

const { Ci, Cu } = require('chrome');
const { Class } = require('sdk/core/heritage');
const { Disposable } = require('sdk/core/disposable');

const store = require('sdk/simple-storage').storage;

const Metrics = require('./metrics');

const TESTPILOT_TELEMETRY_CHANNEL = 'testpilot-telemetry';

Cu.import('resource://gre/modules/XPCOMUtils.jsm');

XPCOMUtils.defineLazyModuleGetter(this, 'Services',
                                  'resource://gre/modules/Services.jsm');

const {getExtensionUUID} = Cu.import('resource://gre/modules/Extension.jsm', {});

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
  const baseURI = Services.io
        .newURI(`moz-extension://${targetExtensionUUID}/_blank.html`, null, null);

  // Create a principal (security context) for the generalized origin given
  // by the extension's special URL and its `addonId`.
  const principal = Services.scriptSecurityManager
        .createCodebasePrincipal(baseURI, { addonId });

  // Create a hidden window and open the special about:blank page for the
  // extension.
  const addonChromeWebNav = Services.appShell.createWindowlessBrowser(true);
  const docShell = addonChromeWebNav.QueryInterface(Ci.nsIInterfaceRequestor) // eslint-disable-line new-cap
        .getInterface(Ci.nsIDocShell);
  docShell.createAboutBlankContentViewer(principal);
  const window = docShell.contentViewer.DOMDocument.defaultView;

  // Finally, get the BroadcastChannel associated with the extension.
  const addonBroadcastChannel = new window.BroadcastChannel(name);

  // Callers need to keep the pointer to the window, otherwise the window's
  // BroadcastChannel will get garbage collected.
  return {
    addonChromeWebNav,
    addonBroadcastChannel
  };
}

const WebExtensionChannel = Class({ // eslint-disable-line new-cap
  implements: [Disposable],

  initialize(targetAddonId) {
    this.pingListeners = new Set();

    this.targetAddonId = targetAddonId;

    const {
      addonChromeWebNav,
      addonBroadcastChannel
    } = createChannelForAddonId(TESTPILOT_TELEMETRY_CHANNEL, targetAddonId);

    // NOTE: Keep a ref to prevent it from going away during garbage collection
    // (or the BroadcastChannel will stop working).
    this.addonChromeWebNav = addonChromeWebNav;
    this.addonBroadcastChannel = addonBroadcastChannel;

    this.handleEventBound = ev => this.handleEvent(ev);
  },

  dispose() {
    this.addonBroadcastChannel.removeEventListener('message', this.handleEventBound);
    this.addonBroadcastChannel.close();
    this.addonChromeWebNav.close();
    this.pingListeners.clear();

    this.addonBroadcastChannel = null;
    this.addonChromeWebNav = null;
  },

  registerPingListener(callback) {
    this.pingListeners.add(callback);

    if (this.pingListeners.size >= 0) {
      this.addonBroadcastChannel.addEventListener('message', this.handleEventBound);
    }
  },

  unregisterPingListener(callback) {
    this.pingListeners.delete(callback);

    if (this.pingListeners.size === 0) {
      this.addonBroadcastChannel.removeEventListener('message', this.handleEventBound);
    }
  },

  handleEvent(event) {
    if (event.data) {
      this.notifyPing(event.data, {addonId: this.targetAddonId});
    }
  },

  notifyPing(data, sender) {
    for (let pingListener of this.pingListeners) { // eslint-disable-line prefer-const
      try {
        pingListener({
          senderAddonId: sender.addonId,
          testpilotPingData: data
        });
      } catch (err) {
        console.error('Error executing pingListener', err); // eslint-disable-line no-console
      }
    }
  }
});

let channels = {};

module.exports = {
  WebExtensionChannel,

  // Update all the channels on init.
  init() {
    this.updateExperimentChannels();
  },

  // Drop refs to channels for garbage collection
  destroy() {
    channels = {};
  },

  // Rebuild channels for all known experiments
  updateExperimentChannels() {
    channels = {};
    if (store.installedAddons) {
      Object.keys(store.installedAddons).forEach(id => {
        const channel = new WebExtensionChannel(id);
        channels[id] = channel;
        channel.registerPingListener(data =>
          this.handleWebExtensionPing(id, data));
      });
    }
  },

  // Pass a ping message along to Telemetry via Metrics
  handleWebExtensionPing(id, data) {
    Metrics.onExperimentPing({
      subject: id,
      data: JSON.stringify(data)
    });
  }
};
