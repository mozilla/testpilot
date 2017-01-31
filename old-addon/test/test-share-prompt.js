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
  callbacks: MockUtils.callbacks({
    Tabs: ['open']
  })
};
const mockLoader = MockUtils.loader(module, './lib/share-prompt.js', {
  'sdk/simple-storage': {storage: mocks.store},
  'sdk/tabs': mocks.callbacks.Tabs
});
const SharePrompt = mockLoader.require('../lib/share-prompt');
const mockSettings = {
  BASE_URL: 'https://foo.bar',
  env: 'production'
};


exports['test makeUrl'] = assert => {
  assert.ok(SharePrompt.makeUrl().indexOf('undefined') === -1,
    'All variables used to construct the URL of the prompt are defined.');
};


exports['test hasExperimentInstalled'] = assert => {
  // If store.installedAddons is not defined.
  assert.equal(SharePrompt.hasExperimentInstalled(), false,
    'Gracefully handles error conditions.');

  // If store.installedAddons is defined, but empty.
  mocks.store.installedAddons = {};
  assert.equal(SharePrompt.hasExperimentInstalled(), false,
    'Returns false when no experiments installed.');

  // If store.installedAddons is defined and populated.
  mocks.store.installedAddons = {foo: 'bar'};
  assert.equal(SharePrompt.hasExperimentInstalled(), true,
    'Returns true when experiments installed.');
};


exports['test openShareTab'] = assert => {
  SharePrompt.init(mockSettings);
  SharePrompt.openShareTab();

  const tabOpenCalls = mocks.callbacks.Tabs.open.calls();
  const tabOpenUrl = tabOpenCalls[0][0].url;
  assert.equal(1, tabOpenCalls.length, 'A share tab opened as expected.');
  assert.equal(tabOpenUrl, SharePrompt.makeUrl(),
    'Tab opens correct URL.');
};


exports['test calculateDelay'] = assert => {
  // Normal delay returned.
  SharePrompt.init(mockSettings);
  assert.equal(SharePrompt.calculateDelay(), SharePrompt.DELAY,
    'Normal delay returned when ENV is "production".');

  // Shortened delay in local environment returned.
  const localSettings = mockSettings;
  localSettings.env = 'local';
  SharePrompt.init(localSettings);
  assert.equal(SharePrompt.calculateDelay(), SharePrompt.LOCAL_DELAY,
    'Shortened delay applied when ENV is "local".');
};


exports['test shouldOpenTab'] = assert => {
  // User has already seen share prompt.
  mocks.store.sharePrompt = {hasBeenShown: true};
  assert.equal(SharePrompt.shouldOpenTab(), false,
    'Do not open share tab if already shown to user.');

  // Date to show prompt hasn't been set (e.g. no experiments installed)
  mocks.store.sharePrompt = {hasBeenShown: false, showAt: 0};
  assert.equal(SharePrompt.shouldOpenTab(), false,
    'Do not open share tab if showAt has not been set.');

  // Date to show prompt is in the past.
  mocks.store.sharePrompt = {hasBeenShown: false, showAt: Date.now() - 10000};
  assert.equal(SharePrompt.shouldOpenTab(), true,
    'Open share tab if not shown to user and showAt is in the past');

  // Date to show prompt is in the future.
  mocks.store.sharePrompt = {hasBeenShown: false, showAt: Date.now() + 10000};
  assert.equal(SharePrompt.shouldOpenTab(), false,
    'Do not open share tab if not shown to user and showAt is in the future.');
};


exports['test setup => sharePrompt state'] = assert => {
  // Set the sharePrompt state if undefined.
  delete mocks.store.sharePrompt;
  SharePrompt.setup();
  assert.ok(typeof mocks.store.sharePrompt !== 'undefined',
    'sharePrompt state initialized if not already set.');

  // Don't reset sharePrompt state if already defined.
  const MOCK = 'not changed';
  mocks.store.sharePrompt = MOCK;
  SharePrompt.setup();
  assert.equal(mocks.store.sharePrompt, MOCK,
    'Does not reset sharePrompt state if already set.');
};


exports['test setup => set showAt date'] = assert => {
  mocks.store.sharePrompt = {showAt: 0};
  mocks.store.installedAddons = {};

  // If no experiments are installed and not already set.
  SharePrompt.setup();
  assert.equal(mocks.store.sharePrompt.showAt, 0,
    'showAt date not set if no experiments installed.');

  // If experiments are installed and not already set.
  mocks.store.installedAddons = {foo: 'bar'};
  SharePrompt.setup();
  assert.ok(mocks.store.sharePrompt.showAt > 0,
    'showAt date correctly set.');

  // If showAt already set.
  const MOCK = 12345;
  mocks.store.sharePrompt.showAt = MOCK;
  SharePrompt.setup();
  assert.equal(mocks.store.sharePrompt.showAt, MOCK,
    'showAt date not set if already set.');
};


exports['test destroy'] = assert => {
  const MOCK = {foo: 'bar'};
  mocks.store.sharePrompt = MOCK;

  // On shutdown.
  SharePrompt.destroy('shutdown');
  assert.equal(mocks.store.sharePrompt, MOCK,
    'sharePrompt state was deleted on shutdown.');

  // On upgrade.
  SharePrompt.destroy('upgrade');
  assert.equal(mocks.store.sharePrompt, MOCK,
    'sharePrompt state was deleted on upgrade.');

  // On downgrade.
  SharePrompt.destroy('downgrade');
  assert.equal(mocks.store.sharePrompt, MOCK,
    'sharePrompt state was deleted on downgrade.');

  // On disable.
  SharePrompt.destroy('disable');
  assert.equal(mocks.store.sharePrompt, MOCK,
    'sharePrompt state was deleted on disable.');

  // On destroy.
  SharePrompt.destroy('uninstall');
  assert.equal(typeof mocks.store.sharePrompt, 'undefined',
    'sharePrompt state was not deleted on uninstall.');
};


exports['test init'] = assert => {
  // First run.
  SharePrompt.init(mockSettings);
  assert.ok(typeof mocks.store.sharePrompt !== 'undefined', 'setup called');
  assert.equal(mocks.store.sharePrompt.hasBeenShown, false,
               'Share tab not opened on first run.');

  // Tab should open.
  mocks.store.sharePrompt.showAt = Date.now();
  SharePrompt.init(mockSettings);
  assert.equal(1, mocks.callbacks.Tabs.open.calls().length,
    'A share tab was opened.');
  assert.equal(mocks.store.sharePrompt.hasBeenShown, true,
    'Share tab opening was correctly recorded.');
};


before(module.exports, function(name, assert, done) {
  MockUtils.resetCallbacks(mocks.callbacks);
  Object.keys(mocks.store).forEach(key => delete mocks.store[key]);
  done();
});


require('sdk/test').run(exports);
