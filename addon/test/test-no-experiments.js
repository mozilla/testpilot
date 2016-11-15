/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the "License"). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */
const { before } = require('sdk/test/utils');
const MockUtils = require('./lib/mock-utils');


const mocks = {
  store: {},
  callbacks: MockUtils.callbacks({
    Tabs: ['open'],
    Notify: ['createNotificationBox'],
    Metrics: ['sendGAEvent']
  })
};
const mockLoader = MockUtils.loader(module, './lib/no-experiments.js', {
  'sdk/simple-storage': {storage: mocks.store},
  'sdk/tabs': mocks.callbacks.Tabs,
  './lib/notify.js': mocks.callbacks.Notify,
  './lib/metrics.js': mocks.callbacks.Metrics
});
const NoExperiments = mockLoader.require('../lib/no-experiments');


exports['test makeUrl'] = assert => {
  const MOCK_SETTINGS = { BASE_URL: 'foo' };
  NoExperiments.init(MOCK_SETTINGS);
  assert.ok(NoExperiments.makeUrl().includes(MOCK_SETTINGS.BASE_URL));
  assert.ok(NoExperiments.makeUrl().includes(NoExperiments.QS));
  assert.ok(!NoExperiments.makeUrl().includes('undefined'));
};


exports['test hasNoExperimentsInstalled'] = assert => {
  assert.equal(NoExperiments.hasNoExperimentsInstalled(), true,
    'Not handling undefined list of installed experiments.');

  mocks.store.installedAddons = {};
  assert.equal(NoExperiments.hasNoExperimentsInstalled(), true,
    'Not recognizing empty list of experiments.');

  mocks.store.installedAddons = { 'a': 'b' };
  assert.equal(NoExperiments.hasNoExperimentsInstalled(), false,
    'Not recognizing installed experiments.');
};


exports['test shouldShowNotification:experiments'] = assert => {
  mocks.store.noExperiments = { hasBeenShown: false, showAt: 1 };
  assert.equal(NoExperiments.shouldShowNotification(), true,
    'Notification not shown when there are no experiments installed.');

  mocks.store.installedAddons = { 'a': 'b' };
  assert.equal(NoExperiments.shouldShowNotification(), false,
    'Notification shown when there are experiments installed.');
};


exports['test shouldShowNotification:hasBeenShown'] = assert => {
  mocks.store.noExperiments = { hasBeenShown: false, showAt: 1 };
  assert.equal(NoExperiments.shouldShowNotification(), true,
    'Notification not shown when it hasn\'t already been shown.');

  mocks.store.noExperiments.hasBeenShown = true;
  assert.equal(NoExperiments.shouldShowNotification(), false,
    'Notification shown when it has already been shown.');
};


exports['test shouldShowNotification:showAt'] = assert => {
  mocks.store.noExperiments = { hasBeenShown: false, showAt: 1 };
  assert.equal(NoExperiments.shouldShowNotification(), true,
    'Notification not shown when showAt is in the past.');

  mocks.store.noExperiments.showAt = Date.now() + 9999;
  assert.equal(NoExperiments.shouldShowNotification(), false,
    'Notification shown when showAt is in the future.');
};


exports['test setup:store'] = assert => {
  const MOCK = {foo: 'bar'};

  assert.equal(typeof mocks.store.noExperiments, 'undefined',
    'did not start with an empty store.');

  NoExperiments.setup();
  assert.equal(typeof mocks.store.noExperiments, 'object',
    'did not set store when undefined.');

  mocks.store.noExperiments = MOCK;
  NoExperiments.setup();
  assert.equal(mocks.store.noExperiments, MOCK,
    'changed an already-set store.');
};


exports['test setup:showAt'] = assert => {
  const MOCK = 'FOO';

  mocks.store.installedAddons = { 'a': 'b' };
  NoExperiments.setup();
  assert.equal(mocks.store.noExperiments.showAt, null,
    'set a showAt time when there were experiments installed.');

  delete mocks.store.installedAddons;
  mocks.store.noExperiments.showAt = MOCK;
  NoExperiments.setup();
  assert.equal(mocks.store.noExperiments.showAt, MOCK,
    'set a showAt time when one was already set.');

  mocks.store.noExperiments.showAt = null;
  NoExperiments.setup();
  assert.ok(mocks.store.noExperiments.showAt >= Date.now() - 1000,
    'did not correctly set a showAt time.');
};


exports['test destroy'] = assert => {
  const MOCK = {foo: 'bar'};
  mocks.store.noExperiments = MOCK;

  NoExperiments.destroy('shutdown');
  assert.equal(mocks.store.noExperiments, MOCK,
    'noExperiment state was deleted on shutdown.');

  NoExperiments.destroy('upgrade');
  assert.equal(mocks.store.noExperiments, MOCK,
    'noExperiment state was deleted on upgrade.');

  NoExperiments.destroy('downgrade');
  assert.equal(mocks.store.noExperiments, MOCK,
    'noExperiment state was deleted on downgrade.');

  NoExperiments.destroy('disable');
  assert.equal(mocks.store.noExperiments, MOCK,
    'noExperiment state was deleted on disable.');

  NoExperiments.destroy('uninstall');
  assert.equal(typeof mocks.store.noExperiments, 'undefined',
    'noExperiment state was not deleted on uninstall.');
};


exports['test init'] = assert => {
  NoExperiments.init();
  assert.equal(mocks.callbacks.Notify.createNotificationBox.calls().length, 0,
    'Notification created when it shouldn\'t have been.');

  mocks.store.noExperiments = { hasBeenShown: false, showAt: 1 };
  NoExperiments.init();
  assert.equal(mocks.callbacks.Notify.createNotificationBox.calls().length, 1,
    'Notification not created when it should have been.');
  assert.equal(mocks.callbacks.Metrics.sendGAEvent.calls().length, 1,
    'Did not fire a GA event when the notification was created.');
};


before(module.exports, function(name, assert, done) {
  MockUtils.resetCallbacks(mocks.callbacks);
  Object.keys(mocks.store).forEach(key => delete mocks.store[key]);
  done();
});


require('sdk/test').run(exports);
