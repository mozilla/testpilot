/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

/* global TelemetryController */

const {Cu} = require('chrome');

Cu.import('resource://gre/modules/TelemetryController.jsm');

const { setTimeout, clearTimeout } = require('sdk/timers');
const Events = require('sdk/system/events');
const store = require('sdk/simple-storage').storage;
const PrefsService = require('sdk/preferences/service');

// Event type for receiving pings from experiments
const EVENT_SEND_METRIC = 'testpilot::send-metric';

// Minimum interval of time between main Telemetry pings in ms
const PING_INTERVAL = 24 * 60 * 60 * 1000;

// Interval between Telemetry ping time checks, more frequent than the actual
// ping so we can play catch-up if the computer was asleep at the ping time.
const PING_CHECK_INTERVAL = 10 * 60 * 1000;

// List of preferences we'll override on install & restore on uninstall
const PREFERENCE_OVERRIDES = {
  'toolkit.telemetry.enabled': true,
  'datareporting.healthreport.uploadEnabled': true
};

let pingTimer = null;

module.exports = {

  init: function() {
    if (!store.telemetryPingPayload) {
      store.lastTelemetryPingTimestamp = false;
      store.telemetryPingPayload = {
        version: 1,
        tests: {}
      };
    }

    this.maybePingTelemetry();

    Events.on(EVENT_SEND_METRIC, this.onExperimentPing);
  },

  onEnable: function() {
    // Backup existing preference settings and then override.
    store.metricsPrefsBackup = {};
    Object.keys(PREFERENCE_OVERRIDES).forEach(name => {
      store.metricsPrefsBackup[name] = PrefsService.get(name);
      PrefsService.set(name, PREFERENCE_OVERRIDES[name]);
    });
  },

  onDisable: function() {
    // Restore previous preference settings before override.
    if (store.metricsPrefsBackup) {
      Object.keys(PREFERENCE_OVERRIDES).forEach(name => {
        PrefsService.set(name, store.metricsPrefsBackup[name]);
      });
    }
  },

  destroy: function() {
    // Stop the ping timer, if any
    if (pingTimer) {
      clearTimeout(pingTimer);
    }
    Events.off(EVENT_SEND_METRIC, this.onExperimentPing);
  },

  maybePingTelemetry: function() {
    const now = Date.now();
    const shouldPing =
      // Fresh install, no timestamp. Ping immediately.
      (!store.lastTelemetryPingTimestamp) ||
      // Subsequent pings should go out after PING_INTERVAL
      (now - store.lastTelemetryPingTimestamp > PING_INTERVAL);

    if (shouldPing) {
      store.lastTelemetryPingTimestamp = now;
      this.pingTelemetry();
    }

    pingTimer = setTimeout(
      () => this.maybePingTelemetry(),
      PING_CHECK_INTERVAL
    );
  },

  pingTelemetry: function() {
    TelemetryController.submitExternalPing(
      'testpilot',
      store.telemetryPingPayload,
      { addClientId: true, addEnvironment: true }
    );
  },

  updateExperiment: function(addonId, data) {
    store.telemetryPingPayload.tests[addonId] = Object.assign(
      store.telemetryPingPayload.tests[addonId] || {features: {}},
      data
    );
  },

  experimentEnabled: function(addonId) {
    this.updateExperiment(addonId, {last_enabled: Date.now()});
  },

  experimentDisabled: function(addonId) {
    this.updateExperiment(addonId, {last_disabled: Date.now()});
  },

  experimentFeaturesChanged: function(addonId, features) {
    this.updateExperiment(addonId, {features: features});
  },

  onExperimentPing: function(ev) {
    const { subject, data } = ev;
    const dataParsed = JSON.parse(data);

    // TODO: Map add-on ID (subject) to other pingTypes as necessary
    const pingType = 'testpilottest';

    const payload = {
      version: 1,
      test: subject,
      payload: dataParsed
    };

    TelemetryController.submitExternalPing(
      pingType, payload,
      { addClientId: true, addEnvironment: true }
    );
  }

};
