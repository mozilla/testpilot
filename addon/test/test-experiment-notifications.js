/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the "License"). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */
// const self = require('sdk/self');
const { before } = require('sdk/test/utils');
const MockUtils = require('./lib/mock-utils');

const querystring = require('sdk/querystring');

// TODO: Remove this / switch based on --verbose switch?
MockUtils.setDebug(true);

const mocks = {
  store: {},
  callbacks: MockUtils.callbacks({
    Notifications: ['notify'],
    Tabs: ['open']
  })
};

const mockLoader = MockUtils.loader(module, './lib/experiment-notifications.js', {
  'sdk/simple-storage': {storage: mocks.store},
  'sdk/notifications': mocks.callbacks.Notifications,
  'sdk/tabs': mocks.callbacks.Tabs
});

const ExperimentNotifications = mockLoader.require('../lib/experiment-notifications');

exports['test ExperimentNotifications.init()'] = assert => {
  assert.ok(!('notificationsLastChecked' in mocks.store),
            'notificationsLastChecked should not initially be in store');
  assert.ok(!('notificationsProcessed' in mocks.store),
            'notificationsProcessed should not initially be in store');

  ExperimentNotifications.init();

  assert.ok('notificationsLastChecked' in mocks.store,
            'notificationsLastChecked should be in store after init');
  assert.ok('notificationsProcessed' in mocks.store,
            'notificationsProcessed should be in store after init');
};

exports['test ExperimentNotifications.destroy()'] = assert => {
  // A no-op, but let's at least ensure it can be called without error.
  ExperimentNotifications.destroy();
  assert.pass();
};

exports['test ExperimentNotifications.uninstall()'] = assert => {
  mocks.store.notificationsLastChecked = Date.now();
  mocks.store.notificationsProcessed = {};

  ExperimentNotifications.uninstall();

  assert.ok(!('notificationsLastChecked' in mocks.store),
            'notificationsLastChecked should not be in store');
  assert.ok(!('notificationsProcessed' in mocks.store),
            'notificationsProcessed should not be in store');
};

exports['test nothing happens with no available experiments'] = assert => {
  mocks.store.availableExperiments = null;
  ExperimentNotifications.maybeSendNotifications();
  assert.pass();
};

exports['test first batch of notifications should be ignored'] = assert => {
  mocks.store.notificationsProcessed = {};
  mocks.store.availableExperiments = {
    '@foo': {notifications: [{id: '8'}, {id: '6'}]},
    '@bar': {notifications: [{id: '7'}, {id: '5'}, {id: '3'}]},
    '@baz': {}
  };

  ExperimentNotifications.maybeSendNotifications();

  const resultIDs = Object.keys(mocks.store.notificationsProcessed);
  resultIDs.sort();
  assert.deepEqual(['3', '5', '6', '7', '8'], resultIDs,
                   'all the notification IDs should have been marked as processed');
  assert.equal(0, mocks.callbacks.Notifications.notify.calls().length,
               'no notifications should have been sent');
};

exports['test single notification'] = assert => {
  const now = Date.now();

  const expectedTitle = 'foo title';
  const expectedText = 'foo text';
  const expectedID = '123';
  const expectedURL = 'http://example.com/foo?' + querystring.stringify({
    utm_source: 'testpilot-addon',
    utm_medium: 'firefox-browser',
    utm_campaign: 'push notification',
    utm_content: expectedID
  });

  // Populate this with one fake notification so that the first-batch-ignored
  // code gets skipped.
  mocks.store.notificationsProcessed = {345: true};

  mocks.store.availableExperiments = {
    '@foo': {
      html_url: 'http://example.com/foo',
      notifications: [
        {id: expectedID, title: expectedTitle, text: expectedText, notify_after: now - 3600}
      ]
    }
  };

  ExperimentNotifications.maybeSendNotifications();

  const notifyCalls = mocks.callbacks.Notifications.notify.calls();
  assert.equal(1, notifyCalls.length,
               'a notification should be displayed');

  const resultNotification = notifyCalls[0][0];
  assert.equal(expectedTitle, resultNotification.title);
  assert.equal('via testpilot.firefox.com\n' + expectedText, resultNotification.text);
  resultNotification.onClick();

  const tabOpenCalls = mocks.callbacks.Tabs.open.calls();
  assert.equal(1, tabOpenCalls.length,
               'a tab should be opened on notification click');

  const resultURL = tabOpenCalls[0][0];
  assert.equal(expectedURL, resultURL,
               'the tab should be opened to the expected notification URL');
};

exports['test random per-experiment notifications should be sent from incoming batch'] = assert => {
  const now = Date.now();

  mocks.store.availableExperiments = {
    '@foo': {
      html_url: 'http://example.com/foo',
      notifications: [
        {id: '0', title: 'foo 0 title', text: 'foo 20 text', notify_after: now + 86400},
        {id: '1', title: 'foo 1 title', text: 'foo 21 text', notify_after: now - 3600},
        {id: '2', title: 'foo 2 title', text: 'foo 22 text', notify_after: now - 3600},
        {id: '3', title: 'foo 3 title', text: 'foo 23 text', notify_after: now - 3600}
      ]
    },
    '@bar': {
      html_url: 'http://example.com/bar',
      notifications: [
        {id: '30', title: 'bar 30 title', text: 'bar 20 text', notify_after: now + 86400},
        {id: '31', title: 'bar 31 title', text: 'bar 21 text', notify_after: now - 3600},
        {id: '32', title: 'bar 32 title', text: 'bar 22 text', notify_after: now - 3600},
        {id: '33', title: 'bar 33 title', text: 'bar 23 text', notify_after: now - 3600}
      ]
    },
    '@baz': {
      html_url: 'http://example.com/baz',
      notifications: [
        {id: '10', title: 'baz 10 title', text: 'baz 20 text', notify_after: now + 86400},
        {id: '11', title: 'baz 11 title', text: 'baz 21 text', notify_after: now - 3600},
        {id: '12', title: 'baz 12 title', text: 'baz 22 text', notify_after: now - 3600},
        {id: '13', title: 'baz 13 title', text: 'baz 23 text', notify_after: now - 3600}
      ]
    },
    '@quux': {
      html_url: 'http://example.com/quux',
      notifications: [
        {id: '20', title: 'quux 20 title', text: 'quux 20 text', notify_after: now + 86400},
        {id: '21', title: 'quux 21 title', text: 'quux 21 text', notify_after: now - 3600},
        {id: '22', title: 'quux 22 title', text: 'quux 22 text', notify_after: now - 3600},
        {id: '23', title: 'quux 23 title', text: 'quux 23 text', notify_after: now - 3600}
      ]
    }
  };

  const expectedSentExperiments = ['baz', 'quux'];
  const expectedSentNotifications = ['11', '12', '21', '22'];
  const expectedIgnoredNotifications = ['0', '1', '2', '3', '30', '31', '32', '33', '13', '23'];

  mocks.store.notificationsProcessed = {};
  expectedIgnoredNotifications.forEach(id => mocks.store.notificationsProcessed[id] = Date.now());

  ExperimentNotifications.maybeSendNotifications();

  const notifyCalls = mocks.callbacks.Notifications.notify.calls();
  assert.equal(2, notifyCalls.length,
               '2 notifications should have been sent');

  const expectedURLs = [];
  notifyCalls.forEach(args => {
    const data = args[0];
    const [resultName, resultID, titleString] = data.title.split(' ');

    assert.equal('title', titleString, 'title should be a title');
    assert.ok(expectedSentExperiments.indexOf(resultName) !== -1,
              'random notification name should appear in expected list');
    assert.ok(expectedSentNotifications.indexOf(resultID) !== -1,
              'random notification ID should appear in expected list');

    expectedURLs.push('http://example.com/' + resultName + '?' + querystring.stringify({
      utm_source: 'testpilot-addon',
      utm_medium: 'firefox-browser',
      utm_campaign: 'push notification',
      utm_content: resultID
    }));

    data.onClick();
  });

  const tabOpenCalls = mocks.callbacks.Tabs.open.calls();
  assert.equal(2, tabOpenCalls.length,
               'clicking 2 notifications should open 2 tabs');

  const resultURLs = tabOpenCalls.map(args => args[0]);
  assert.deepEqual(expectedURLs, resultURLs,
                   'the tabs opened by clicking notifications should result in expected URLs');
};

before(module.exports, function(name, assert, done) {
  MockUtils.resetCallbacks(mocks.callbacks);
  Object.keys(mocks.store).forEach(key => delete mocks.store[key]);
  done();
});

require('sdk/test').run(module.exports);
