/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the "License"). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

const { before } = require('sdk/test/utils');
const MockUtils = require('./lib/mock-utils');

// TODO: Remove this / switch based on --verbose switch?
MockUtils.setDebug(true);

const BLOK_ID = 'blok@mozilla.org';
const mocks = {
  store: {},
  callbacks: MockUtils.callbacks({
    PrefsService: ['get', 'set']
  })
};
const TP_PREFS = {
  'privacy.trackingprotection.enabled': false,
  'privacy.trackingprotection.pbmode.enabled': true,
  'services.sync.prefs.sync.privacy.trackingprotection.enabled': false,
  'services.sync.prefs.sync.privacy.trackingprotection.pbmode.enabled': false
};

const PREFNAMES = Object.keys(TP_PREFS);

const mockLoader = MockUtils.loader(module, './lib/experiment-hacks.js', {
  'sdk/simple-storage': { storage: mocks.store },
  'sdk/preferences/service': mocks.callbacks.PrefsService
});

const hacks = mockLoader.require('../lib/experiment-hacks');

exports['test fresh enabled with blok id'] = assert => {
  const expected = PREFNAMES.map(p => [p, true]);
  mocks.callbacks.PrefsService.get.implement(() => true);

  hacks.enabled(BLOK_ID);

  const gets = mocks.callbacks.PrefsService.get.calls();
  const sets = mocks.callbacks.PrefsService.set.calls();
  assert.equal(gets.length, 4, 'got original prefs');
  assert.equal(sets.length, 4, 'set prefs');
  sets.forEach(set => {
    assert.ok(PREFNAMES.includes(set[0]));
    assert.equal(set[1], TP_PREFS[set[0]], `${set[0]} set ok`);
  });
  assert.deepEqual(mocks.store.tpPrefs, expected, 'prefs set as expected');
};

exports['test enabled with blok id when already set'] = assert => {
  const expected = PREFNAMES.map(p => [p, true]);
  mocks.callbacks.PrefsService.get.implement(() => true);
  // once to set
  hacks.enabled(BLOK_ID);
  MockUtils.resetCallbacks(mocks.callbacks);
  // another to test
  hacks.enabled(BLOK_ID);
  const gets = mocks.callbacks.PrefsService.get.calls();
  const sets = mocks.callbacks.PrefsService.set.calls();
  assert.equal(gets.length, 0, 'no gets called');
  assert.equal(sets.length, 4, 'set prefs');
  sets.forEach(set => {
    assert.ok(PREFNAMES.includes(set[0]));
    assert.equal(set[1], TP_PREFS[set[0]], `${set[0]} set ok`);
  });
  assert.deepEqual(mocks.store.tpPrefs, expected, 'prefs set as expected');
};

exports['test enabled with non-blok id'] = assert => {
  hacks.enabled('foo');

  const gets = mocks.callbacks.PrefsService.get.calls();
  const sets = mocks.callbacks.PrefsService.set.calls();
  assert.equal(gets.length, 0, 'got original prefs');
  assert.equal(sets.length, 0, 'set prefs');
  assert.equal(mocks.store.tpPrefs, undefined);
};

exports['test disabled after enabled with blok id'] = assert => {
  mocks.callbacks.PrefsService.get.implement(() => true);

  hacks.enabled(BLOK_ID);
  MockUtils.resetCallbacks(mocks.callbacks);
  hacks.disabled(BLOK_ID);

  const sets = mocks.callbacks.PrefsService.set.calls();
  assert.equal(sets.length, 4, 'set prefs');
  sets.forEach(set => {
    assert.ok(PREFNAMES.includes(set[0]));
    assert.equal(set[1], true, `${set[0]} set to true`);
  });
  assert.equal(mocks.store.tpPrefs, undefined, 'tpPrefs was cleared');
};

exports['test disabled without enabled'] = assert => {
  hacks.disabled(BLOK_ID);

  const sets = mocks.callbacks.PrefsService.set.calls();
  assert.equal(sets.length, 0, 'no set prefs');
  assert.equal(mocks.store.tpPrefs, undefined);
};

exports['test disabled non-blok id'] = assert => {
  const expected = PREFNAMES.map(p => [p, true]);
  mocks.callbacks.PrefsService.get.implement(() => true);

  hacks.enabled(BLOK_ID);
  MockUtils.resetCallbacks(mocks.callbacks);
  hacks.disabled('foo');

  const sets = mocks.callbacks.PrefsService.set.calls();
  assert.equal(sets.length, 0, 'no set prefs');
  assert.deepEqual(mocks.store.tpPrefs, expected);
};

before(module.exports, function(name, assert, done) {
  MockUtils.resetCallbacks(mocks.callbacks);
  delete mocks.store.tpPrefs;
  done();
});

require('sdk/test').run(module.exports);
