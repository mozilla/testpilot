/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the "License"). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */
// const self = require('sdk/self');
const { before } = require('sdk/test/utils');
const MockUtils = require('./lib/mock-utils');

const ONE_DAY = 24 * 60 * 60 * 1000;

// TODO: Remove this / switch based on --verbose switch?
MockUtils.setDebug(true);

const mocks = {
  store: {},
  callbacks: MockUtils.callbacks({
    Metrics: ['pingTelemetry'],
    Request: ['get'],
    timers: ['setTimeout', 'clearTimeout'],
    Tabs: ['open']
  })
};

function Request() {}
Request.prototype.get = function() { return mocks.callbacks.Request.get.apply(this, arguments); };

const mockLoader = MockUtils.loader(module, './lib/survey.js', {
  'sdk/simple-storage': {storage: mocks.store},
  'sdk/request': {Request},
  'sdk/tabs': mocks.callbacks.Tabs,
  'sdk/timers': mocks.callbacks.timers,
  './lib/metrics.js': mocks.callbacks.Metrics
});

const Survey = mockLoader.require('../lib/survey');

exports['test init with no active experiments'] = assert => {
  mocks.callbacks.timers.setTimeout.implement(fn => fn());
  Survey.init();
  const calls = mocks.callbacks.timers.setTimeout.calls();
  // if setTimeout was called more than once it means launchSurvey
  // was called
  assert.equal(calls.length, 1, 'setTimeout called once');
};

exports['test init with a fresh active experiment'] = assert => {
  mocks.store.installedAddons = {
    x: {
      addon_id: 'x',
      installDate: new Date()
    }
  };
  mocks.callbacks.timers.setTimeout.implement(fn => fn());
  Survey.init();
  const calls = mocks.callbacks.timers.setTimeout.calls();
  // if setTimeout was called more than once it means launchSurvey
  // was called
  assert.equal(calls.length, 1, 'setTimeout called once');
};

exports['test init with an 3 day old active experiment'] = assert => {
  mocks.store.installedAddons = {
    x: {
      addon_id: 'x',
      installDate: new Date(Date.now() - (ONE_DAY * 3))
    }
  };
  mocks.callbacks.timers.setTimeout.implement(fn => fn());
  Survey.init();
  const calls = mocks.callbacks.timers.setTimeout.calls();
  // if setTimeout was called more than once it means launchSurvey
  // was called
  assert.equal(calls.length, 2, 'setTimeout called twice');
};

exports['test init with an 3 day old, previously rated, active experiment'] = assert => {
  mocks.store.installedAddons = {
    x: {
      addon_id: 'x',
      installDate: new Date(Date.now() - (ONE_DAY * 3))
    }
  };
  mocks.store.surveyChecks.twoDaysSent = { 'x': true };
  mocks.callbacks.timers.setTimeout.implement(fn => fn());
  Survey.init();
  delete mocks.store.surveyChecks.twoDaysSent.x;
  const calls = mocks.callbacks.timers.setTimeout.calls();
  // if setTimeout was called more than once it means launchSurvey
  // was called
  assert.equal(calls.length, 1, 'setTimeout called once');
};

before(module.exports, function(name, assert, done) {
  MockUtils.resetCallbacks(mocks.callbacks);
  delete mocks.store.installedAddons;
  done();
});

require('sdk/test').run(module.exports);
