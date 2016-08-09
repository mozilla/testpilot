/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

/* global TelemetryController, Services */

const {Cu} = require('chrome');

Cu.import('resource://gre/modules/Services.jsm');
Cu.import('resource://gre/modules/TelemetryController.jsm');

const { AddonManager } = require('resource://gre/modules/AddonManager.jsm');
const Events = require('sdk/system/events');
const PrefsService = require('sdk/preferences/service');
const self = require('sdk/self');
const store = require('sdk/simple-storage').storage;

const seedrandom = require('seedrandom');

// Event type for receiving pings from experiments
const EVENT_SEND_METRIC = 'testpilot::send-metric';
const EVENT_RECEIVE_VARIANT_DEFS = 'testpilot::register-variants';
const EVENT_SEND_VARIANTS = 'testpilot::receive-variants';

// List of preferences we'll override on install & restore on uninstall
const PREFERENCE_OVERRIDES = {
  'toolkit.telemetry.enabled': true,
  'datareporting.healthreport.uploadEnabled': true
};

// nsIObserver message subjects.
const TELEMETRY_TESTPILOT = 'testpilot';
const TELEMETRY_EXPERIMENT = 'testpilottest';

const variantMaker = {
  makeTest: function(test) {
    let summedWeight = 0;
    const variants = [];
    test.variants.forEach(variant => {
      summedWeight += variant.weight;
      for (let i = 0; i < variant.weight; i++) {
        variants.push(variant.value);
      }
    });
    const seed = `${test.name}_${store.clientUUID}`;
    return variants[Math.floor(seedrandom(seed)() * summedWeight)];
  },

  parseTests: function(tests) {
    const results = {};
    Object.keys(tests).forEach(key => {
      results[key] = this.makeTest(tests[key]);
    });
    return results;
  }
};


function makeTimestamp(time) {
  const timestamp = typeof time !== 'undefined' ?  time : Date.now();
  return Math.round((timestamp - Services.startup.getStartupInfo().process) / 1000);
}


const Metrics = module.exports = {

  init: function() {
    Events.on(EVENT_SEND_METRIC, Metrics.onExperimentPing);
    Events.on(EVENT_RECEIVE_VARIANT_DEFS, Metrics.onReceiveVariantDefs);
  },

  onEnable: function() {
    Metrics.pingTelemetry(self.id, 'enabled', Date.now());
    Metrics.prefs.backup();
  },

  onDisable: function() {
    Metrics.pingTelemetry(self.id, 'disabled', Date.now());
    Metrics.prefs.restore();
  },

  prefs: {
    // Backup existing preference settings and then override.
    backup: function() {
      store.metricsPrefsBackup = {};
      Object.keys(PREFERENCE_OVERRIDES).forEach(name => {
        store.metricsPrefsBackup[name] = PrefsService.get(name);
        PrefsService.set(name, PREFERENCE_OVERRIDES[name]);
      });
    },

    // Restore previous preference settings before override.
    restore: function() {
      if (store.metricsPrefsBackup) {
        Object.keys(PREFERENCE_OVERRIDES).forEach(name => {
          PrefsService.set(name, store.metricsPrefsBackup[name]);
        });
      }
    }
  },

  destroy: function() {
    Events.off(EVENT_SEND_METRIC, Metrics.onExperimentPing);
    Events.off(EVENT_RECEIVE_VARIANT_DEFS, Metrics.onReceiveVariantDefs);
  },

  pingTelemetry: function(object, eventName, eventTimestamp) {
    const payload = {
      timestamp: makeTimestamp(),
      test: self.id,
      version: self.version,
      events: [
        {
          timestamp: makeTimestamp(eventTimestamp),
          event: eventName,
          object: object
        }
      ]
    };
    TelemetryController.submitExternalPing(
      TELEMETRY_TESTPILOT,
      payload,
      { addClientId: true, addEnvironment: true }
    );
  },

  experimentEnabled: function(addonId) {
    Metrics.pingTelemetry(addonId, 'enabled', Date.now());
  },

  experimentDisabled: function(addonId) {
    Metrics.pingTelemetry(addonId, 'disabled', Date.now());
  },

  onReceiveVariantDefs: function(ev) {
    if (!store.experimentVariants) {
      store.experimentVariants = {};
    }

    const { subject, data } = ev;
    const dataParsed = variantMaker.parseTests(JSON.parse(data));

    store.experimentVariants[subject] = dataParsed;
    Events.emit(EVENT_SEND_VARIANTS, {
      data: JSON.stringify(dataParsed),
      subject: self.id
    });
  },

  onExperimentPing: function(ev) {
    const timestamp = Date.now();
    const { subject, data } = ev;

    AddonManager.getAddonByID(subject, addon => {
      const payload = {
        test: subject,
        version: addon.version,
        timestamp: makeTimestamp(timestamp),
        variants: (
          (store.experimentVariants && subject in store.experimentVariants) ?
          store.experimentVariants[subject] : null
        ),
        payload: JSON.parse(data)
      };
      TelemetryController.submitExternalPing(
        TELEMETRY_EXPERIMENT, payload,
        { addClientId: true, addEnvironment: true }
      );
    });
  }
};
