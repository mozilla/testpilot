/* global describe beforeEach it */
import assert from 'assert';
import proxyquire from 'proxyquire';
import sinon from 'sinon';

const timers = {
  setTimeout: sinon.stub().callsArg(0),
  clearTimeout: sinon.spy(),
  '@noCallThru': true
};

const notificationUI = { notify: sinon.spy(), '@noCallThru': true };

const NotificationManager = proxyquire(
  '../src/lib/actionCreators/NotificationManager',
  { 'sdk/timers': timers, '../notificationUI': notificationUI }
).default;

describe('NotificationManager', function() {
  beforeEach(function() {
    timers.setTimeout.reset();
    timers.clearTimeout.reset();
  });

  it('initializes', function() {
    const store = {};
    const nm = new NotificationManager(store);
    assert.equal(nm.store, store);
  });

  it('schedules a check', function() {
    const nextCheck = Date.now();
    const state = {
      experiments: { x: { notifications: [] }, y: { notifications: [] } },
      notifications: { lastNotified: nextCheck - 1, nextCheck }
    };
    const store = {
      getState: sinon.stub().returns(state),
      dispatch: sinon.spy()
    };
    const nm = new NotificationManager(store);
    nm.schedule();

    assert.ok(timers.setTimeout.calledOnce);
    assert.ok(store.dispatch.calledTwice);
    assert.equal(store.dispatch.firstCall.args[0].type, 'SCHEDULE_NOTIFIER');
    assert.equal(store.dispatch.secondCall.args[0].type, 'SCHEDULE_NOTIFIER');
  });
});
