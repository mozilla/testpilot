/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the "License"). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */
const self = require('sdk/self');
const { before } = require('sdk/test/utils');
const MockUtils = require('./lib/mock-utils');

const BROWSER_DURATION = 60 * 60;
const EVENT_SEND_METRIC = 'testpilot::send-metric';
const EVENT_RECEIVE_VARIANT_DEFS = 'testpilot::register-variants';
const EVENT_SEND_VARIANTS = 'testpilot::receive-variants';
const TELEMETRY_TESTPILOT = 'testpilot';
const TELEMETRY_EXPERIMENT = 'testpilottest';
const PREFERENCE_OVERRIDES = {
  'toolkit.telemetry.enabled': true,
  'datareporting.healthreport.uploadEnabled': true
};

// TODO: Remove this / switch based on --verbose switch?
MockUtils.setDebug(true);

const mocks = {
  store: {},
  callbacks: MockUtils.callbacks({
    seedrandom: ['seedrandom'],
    Events: ['on', 'off', 'emit'],
    TelemetryController: ['submitExternalPing'],
    AddonManager: ['getAddonByID'],
    request: ['post'],
    PrefsService: ['set', 'get']
  })
};

const mockLoader = MockUtils.loader(module, './lib/metrics.js', {
  './node_modules/seedrandom/index.js': mocks.callbacks.seedrandom.seedrandom,
  'sdk/request': {
    Request: function() {
      return mocks.callbacks.request;
    }
  },
  'sdk/simple-storage': {storage: mocks.store},
  'sdk/system/events': mocks.callbacks.Events,
  'sdk/preferences/service': mocks.callbacks.PrefsService,
  'resource://gre/modules/AddonManager.jsm': {
    AddonManager: mocks.callbacks.AddonManager
  },
  'resource://gre/modules/TelemetryController.jsm': {
    TelemetryController: mocks.callbacks.TelemetryController
  },
  'resource://gre/modules/Services.jsm': {
    Services: {
      startup: {
        getStartupInfo: () => (
          {process: Date.now() - (BROWSER_DURATION * 1000)}
        )
      }
    }
  }
});

const Metrics = mockLoader.require('../lib/metrics');

exports['test Metrics.init()'] = assert => {
  Metrics.init();

  const onCalls = mocks.callbacks.Events.on.calls();

  assert.equal(onCalls.length, 2,
               'Events.on() should have been called twice');

  const expectedCases = [
    EVENT_SEND_METRIC,
    EVENT_RECEIVE_VARIANT_DEFS
  ];
  expectedCases.forEach((expected, idx) => {
    assert.equal(onCalls[idx][0], expected,
                 'Call ' + idx + ' should be ' + expected);
  });
};

exports['test Metrics.onEnable()'] = assert => {
  Metrics.onEnable();

  const submitExternalPingCalls = mocks.callbacks.TelemetryController.submitExternalPing.calls();

  assert.equal(1, submitExternalPingCalls.length,
               'should have called TelemetryController.submitExternalPing');

  const args = submitExternalPingCalls[0];
  assert.equal(args[0], 'testpilot',
               'submitExternalPing() subject is testpilot');
  assert.equal(args[1].events[0].event, 'enabled',
               'submitExternalPing() payload includes enabled event');

  // Minimal proof that Metrics.prefs.backup() was called
  assert.equal(mocks.callbacks.PrefsService.get.calls().length, 2,
               'PrefsService.get() called for backup');
  assert.equal(mocks.callbacks.PrefsService.set.calls().length, 2,
               'PrefsService.set() called for override');
};

exports['test Metrics.onDisable()'] = assert => {
  mocks.store.metricsPrefsBackup = {garbage: 'garbage'};

  Metrics.onDisable();

  const submitExternalPingCalls = mocks.callbacks.TelemetryController.submitExternalPing.calls();

  assert.equal(1, submitExternalPingCalls.length,
               'should have called TelemetryController.submitExternalPing');

  const args = submitExternalPingCalls[0];
  assert.equal(args[0], 'testpilot',
               'submitExternalPing() subject is testpilot');
  assert.equal(args[1].events[0].event, 'disabled',
               'submitExternalPing() payload includes disabled event');

  // Minimal proof that Metrics.prefs.restore() was called
  assert.equal(mocks.callbacks.PrefsService.set.calls().length, 2,
               'PrefsService.set() called for restore');
};

exports['test Metrics.prefs.backup()'] = assert => {
  mocks.store.metricsPrefsBackup = {garbage: 'value'};

  const origPrefs = {
    'toolkit.telemetry.enabled': 'garbage',
    'datareporting.healthreport.uploadEnabled': 'garbage'
  };
  mocks.callbacks.PrefsService.get
    .implement(name => origPrefs[name]);

  const newPrefs = {};
  mocks.callbacks.PrefsService.set
    .implement((name, val) => newPrefs[name] = val);

  Metrics.prefs.backup();

  assert.deepEqual(mocks.store.metricsPrefsBackup, origPrefs,
                   'backup should match original prefs');
  assert.deepEqual(newPrefs, PREFERENCE_OVERRIDES,
                   'new prefs should match overrides');
};

exports['test Metrics.prefs.restore()'] = assert => {
  mocks.store.metricsPrefsBackup = {
    'toolkit.telemetry.enabled': 'garbage',
    'datareporting.healthreport.uploadEnabled': 'garbage'
  };

  const newPrefs = {};
  mocks.callbacks.PrefsService.set
    .implement((name, val) => newPrefs[name] = val);

  Metrics.prefs.restore();

  assert.deepEqual(newPrefs, mocks.store.metricsPrefsBackup,
                   'new prefs should match backup');
};

exports['test Metrics.destroy()'] = assert => {
  Metrics.init();
  Metrics.destroy();

  const offCalls = mocks.callbacks.Events.off.calls();

  assert.equal(offCalls.length, 2,
               'Events.off() should have been called twice');

  const expectedCases = [
    EVENT_SEND_METRIC,
    EVENT_RECEIVE_VARIANT_DEFS
  ];
  expectedCases.forEach((expected, idx) => {
    assert.equal(offCalls[idx][0], expected,
                 'Call ' + idx + ' should be ' + expected);
  });
};

exports['test Metrics.pingTelemetry()'] = assert => {
  const name = 'test-event-name';
  const object = {alpha: 1, beta: 2};
  const timestamp = Date.now();

  Metrics.pingTelemetry(object, name, timestamp);

  const pingCalls = mocks.callbacks.TelemetryController.submitExternalPing.calls();

  assert.equal(pingCalls.length, 1, 'There should be 1 call to telemetry');

  const args = pingCalls[0];
  assert.equal(args[0], TELEMETRY_TESTPILOT, 'subject should be testpilot');
  assert.deepEqual(args[1], {
    'timestamp': BROWSER_DURATION,
    'test': self.id,
    'version': self.version,
    'events': [
      {
        'timestamp': BROWSER_DURATION,
        'event': name,
        'object': object
      }
    ]
  }, 'payload should have expected structure');
  assert.deepEqual(args[2], {addClientId: true, addEnvironment: true},
                   'options should include client ID and environment');
};

exports['test Metrics.experimentEnabled'] = assert => {
  const addonId = '@foo-bar';
  Metrics.experimentEnabled(addonId);
  const pingCalls = mocks.callbacks.TelemetryController.submitExternalPing.calls();
  assert.equal(pingCalls.length, 1, 'There should be 1 call to telemetry');
  const args = pingCalls[0];
  assert.equal(args[0], TELEMETRY_TESTPILOT, 'subject should be testpilot');
  assert.deepEqual(args[1], {
    'timestamp': BROWSER_DURATION,
    'test': self.id,
    'version': self.version,
    'events': [
      { 'timestamp': BROWSER_DURATION, 'event': 'enabled', 'object': addonId }
    ]
  }, 'payload should have expected structure');
};

exports['test Metrics.experimentDisabled'] = assert => {
  const addonId = '@foo-bar';
  Metrics.experimentDisabled(addonId);
  const pingCalls = mocks.callbacks.TelemetryController.submitExternalPing.calls();
  assert.equal(pingCalls.length, 1, 'There should be 1 call to telemetry');
  const args = pingCalls[0];
  assert.equal(args[0], TELEMETRY_TESTPILOT, 'subject should be testpilot');
  assert.deepEqual(args[1], {
    'timestamp': BROWSER_DURATION,
    'test': self.id,
    'version': self.version,
    'events': [
      { 'timestamp': BROWSER_DURATION, 'event': 'disabled', 'object': addonId }
    ]
  }, 'payload should have expected structure');
};

exports['test onReceiveVariantDefs()'] = assert => {
  const subject = '@foo-bar-baz';

  const payload = {
    firstTest: {
      name: 'first test name',
      description: 'the first thing',
      variants: [
        { value: 'foo', weight: 1, description: 'option foo' },
        { value: 'bar', weight: 1, description: 'option bar' }
      ]
    },
    secondTest: {
      name: 'second test name',
      description: 'the second thing',
      variants: [
        { value: 'baz', weight: 2, description: 'option baz' },
        { value: 'quux', weight: 2, description: 'option foo' },
        { value: 'xyzzy', weight: 1, description: 'option xyzzy' }
      ]
    }
  };
  const data = JSON.stringify(payload);

  mocks.store.clientUUID = '8675309';

  // Establish some canned 'random' values for variant selection and implement
  // seedrandom() to return them based on known seeds.
  let randValues = {
    'first test name_8675309': 0.2,
    'second test name_8675309': 0.9
  };
  mocks.callbacks.seedrandom.seedrandom.implement((seed) => () => {
    assert.ok(seed in randValues, 'seed should be found in known values');
    return randValues[seed];
  });

  // Try selecting variants and assert the result.
  Metrics.onReceiveVariantDefs({subject, data});
  const expected = {
    firstTest: 'foo',
    secondTest: 'xyzzy'
  };
  const result = mocks.store.experimentVariants['@foo-bar-baz'];
  assert.deepEqual(result, expected);

  const emitCalls = mocks.callbacks.Events.emit.calls();
  assert.equal(emitCalls.length, 1,
               'Events.emit() should have been called');

  const args = emitCalls[0];
  assert.equal(args[0], EVENT_SEND_VARIANTS,
               'Events.emit() should have been called with EVENT_SEND_VARIANTS');
  assert.deepEqual(args[1], {
    subject: self.id,
    data: JSON.stringify(expected)
  }, 'Events.emit() payload should be JSON encoded variants');

  // Tweak the "random" value and assert the variant changes, for good measure.
  randValues = {
    'first test name_8675309': 0.6,
    'second test name_8675309': 0.1
  };
  Metrics.onReceiveVariantDefs({subject, data});
  assert.deepEqual(mocks.store.experimentVariants, {
    '@foo-bar-baz': {
      firstTest: 'bar',
      secondTest: 'baz'
    }
  }, 'variants should change as expected when random values change');
};

exports['test Metrics.onExperimentPing'] = assert => {
  const subject = 'test-subject';
  const object = {alpha: 1, beta: 2};
  const data = JSON.stringify(object);
  const addon = { version: '2.0' };

  mocks.callbacks.AddonManager.getAddonByID.implement((resultSubject, cb) => {
    assert.equal(resultSubject, subject);
    cb(addon);
  });

  Metrics.onExperimentPing({subject, data});

  assert.equal(mocks.callbacks.AddonManager.getAddonByID.calls().length, 1);

  const pingCalls = mocks.callbacks.TelemetryController.submitExternalPing.calls();
  assert.equal(pingCalls.length, 1, 'There should be 1 call to telemetry');

  const args = pingCalls[0];
  assert.equal(args[0], TELEMETRY_EXPERIMENT, 'subject should be experiment');
  assert.deepEqual(args[1], {
    'test': subject,
    'version': addon.version,
    'timestamp': BROWSER_DURATION,
    'variants': null,
    'payload': object
  }, 'payload should have expected structure');
  assert.deepEqual(args[2], {addClientId: true, addEnvironment: true},
                   'options should include client ID and environment');
};

before(module.exports, function(name, assert, done) {
  MockUtils.resetCallbacks(mocks.callbacks);
  Object.keys(mocks.store).forEach(key => delete mocks.store[key]);
  done();
});

require('sdk/test').run(module.exports);
