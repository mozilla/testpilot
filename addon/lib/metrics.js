/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

/* global TelemetryController */

const {Cu} = require('chrome');

Cu.import('resource://gre/modules/TelemetryController.jsm');

const { setTimeout } = require('sdk/timers');
const Events = require('sdk/system/events');
const store = require('sdk/simple-storage').storage;

// Event type for receiving pings from experiments
const EVENT_SEND_METRIC = 'testpilot::send-metric';

// Minimum interval of time between main Telemetry pings in ms
const PING_INTERVAL = 24 * 60 * 60 * 1000;

// Interval between Telemetry ping time checks, more frequent than the actual
// ping so we can play catch-up if the computer was asleep at the ping time.
const PING_CHECK_INTERVAL = 10 * 60 * 1000;

module.exports = {

  init: function() {
    if (!store.telemetryPing) {
      store.lastTelemetryPingTimestamp = Date.now();
      store.telemetryPingPayload = {
        version: 1,
        tests: {}
      };
    }

    this.maybePingTelemetry();

    Events.on(EVENT_SEND_METRIC, this.onExperimentPing);
  },

  destroy: function() {
    Events.off(EVENT_SEND_METRIC, this.onExperimentPing);
  },

  maybePingTelemetry: function() {
    const now = Date.now();
    const elapsed = now - store.lastTelemetryPingTimestamp;

    if (elapsed > PING_INTERVAL) {
      store.lastTelemetryPingTimestamp = now;
      TelemetryController.submitExternalPing(
        'testpilot',
        store.telemetryPingPayload,
        { addClientId: true, addEnvironment: true }
      );
    }

    this.pingTimer = setTimeout(
      () => this.maybePingTelemetry(),
      PING_CHECK_INTERVAL
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
