/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the "License"). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */
const { before } = require('sdk/test/utils');
const MockUtils = require('./lib/mock-utils');


MockUtils.setDebug(true);

const mocks = {
  store: {},
  tabs: [],
  callbacks: MockUtils.callbacks({
    Tabs: ['open']
  })
};
const mockLoader = MockUtils.loader(module, './lib/first-run.js', {
  'sdk/simple-storage': {storage: mocks.store},
  'sdk/tabs': mocks.callbacks.Tabs
});

const FirstRun = mockLoader.require('../lib/first-run');
const mockSettings = {
  BASE_URL: 'https://foo.bar'
};


exports['test check when first run and Test Pilot open'] = assert => {
  FirstRun.check([{ url: mockSettings.BASE_URL }], mockSettings);
  assert.equal(0, mocks.callbacks.Tabs.open.calls().length,
    'Test Pilot not opened.');
  assert.equal(typeof mocks.store.firstRun, 'undefined');
};


exports['test check when first run and Test Pilot not open'] = assert => {
  FirstRun.check([], mockSettings);
  assert.equal(0, mocks.callbacks.Tabs.open.calls().length,
    'Test Pilot opened.');
  assert.equal(typeof mocks.store.firstRun, 'undefined');
};


exports['test check when not first run and Test Pilot open'] = assert => {
  mocks.store.firstRun = true;
  FirstRun.check([{ url: mockSettings.BASE_URL }], mockSettings);
  assert.equal(0, mocks.callbacks.Tabs.open.calls().length,
    'Test Pilot not opened.');
};


exports['test check when not first run and Test Pilot not open'] = assert => {
  mocks.store.firstRun = true;
  FirstRun.check([], mockSettings);
  assert.equal(0, mocks.callbacks.Tabs.open.calls().length,
    'Test Pilot not opened.');
};


exports['test isFirstRun'] = assert => {
  mocks.store.firstRun = true;
  assert.equal(FirstRun.isFirstRun(), false,
    'When not the first run.');

  delete mocks.store.firstRun;
  assert.equal(FirstRun.isFirstRun(), false,
    'When it is the first run.');
};


exports['test isTestPilotOpen'] = assert => {
  assert.equal(true, FirstRun.isTestPilotOpen([{
    url: `${mockSettings.BASE_URL}`
  }], mockSettings), 'When homepage is open.');

  assert.equal(true, FirstRun.isTestPilotOpen([{
    url: `${mockSettings.BASE_URL}/experiments`
  }], mockSettings), 'When experiment page is open.');

  assert.equal(false, FirstRun.isTestPilotOpen([{
    url: `https://example.com`
  }], mockSettings), 'When different site is open.');
};


exports['test openTestPilot'] = assert => {
  FirstRun.openTestPilot(mockSettings);

  const tabOpenCalls = mocks.callbacks.Tabs.open.calls();
  assert.equal(1, tabOpenCalls.length, 'Test Pilot opened as expected.');
  assert.ok(tabOpenCalls[0][0].url.startsWith(mockSettings.BASE_URL),
    'Tab opens correct environment.');
  assert.ok(tabOpenCalls[0][0].url.endsWith(FirstRun.utm),
    'Tab has correct Google Analytics UTM tags.');
};


exports['test teardown'] = assert => {
  mocks.store.firstRun = 'ohai';

  // On shutdown.
  FirstRun.teardown('shutdown', {});
  assert.ok('firstRun' in mocks.store,
    'firstRun state was not deleted on shutdown.');

  // On upgrade.
  FirstRun.teardown('upgrade', {});
  assert.ok('firstRun' in mocks.store,
    'firstRun state was not deleted on upgrade.');

  // On downgrade.
  FirstRun.teardown('downgrade', {});
  assert.ok('firstRun' in mocks.store,
    'firstRun state was not deleted on downgrade.');

  // On disable.
  FirstRun.teardown('disable', {});
  assert.ok('firstRun' in mocks.store,
    'firstRun state was not deleted on disable.');

  // On teardown.
  FirstRun.teardown('uninstall', {});
  assert.ok(!('firstRun' in mocks.store),
    'firstRun state was deleted on uninstall.');
};


before(module.exports, function(name, assert, done) {
  MockUtils.resetCallbacks(mocks.callbacks);
  Object.keys(mocks.store).forEach(key => delete mocks.store[key]);
  done();
});


require('sdk/test').run(exports);
