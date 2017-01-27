/* global describe beforeEach it */
import assert from 'assert';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import {
  EXPERIMENTS_LOADED,
  EXPERIMENTS_LOAD_ERROR,
  MAYBE_NOTIFY,
  SET_BADGE
} from '../src/lib/actions';

const addons = [
  { id: 'x', isActive: true, installDate: new Date() },
  { id: 'y' }
];
const AddonManager = { getAllAddons: sinon.stub().callsArgWith(0, addons) };
const x = { addon_id: 'x', created: '2015-12-23' };
const res = { status: 200, json: { results: [ x ] } };
const req = { on: sinon.stub().callsArgWithAsync(1, res), get: sinon.spy() };
const Request = sinon.stub().returns(req);

const Services = {
  appShell: { hiddenDOMWindow: { navigator: { language: 'en-US' } } }
};

const timers = {
  setTimeout: sinon.stub(),
  clearTimeout: sinon.spy(),
  '@noCallThru': true
};

const xadd = sinon.spy();

const store = { dispatch: sinon.spy(), getState: sinon.spy() };
const Loader = proxyquire('../src/lib/actionCreators/Loader', {
  'resource://gre/modules/AddonManager.jsm': {
    AddonManager,
    '@noCallThru': true
  },
  'sdk/request': { Request, '@noCallThru': true },
  'resource://gre/modules/Services.jsm': { Services, '@noCallThru': true },
  'sdk/timers': timers,
  '../metrics/webextension-channels': { add: xadd, '@noCallThru': true },
  'sdk/l10n': { get: x => x, '@noCallThru': true }
}).default;

describe('Loader', function() {
  beforeEach(function() {
    AddonManager.getAllAddons.reset();
    AddonManager.getAllAddons.callsArgWith(0, addons);
    Request.reset();
    timers.setTimeout.reset();
    timers.clearTimeout.reset();
    store.dispatch.reset();
    store.getState.reset();
    xadd.reset();
    res.status = 200;
  });

  it('initializes', function() {
    const l = new Loader(store);
    assert.equal(l.store, store);
  });

  describe('schedule', function() {
    it('resets the reload timeout', function() {
      const l = new Loader(store);
      l.schedule();
      assert.ok(timers.clearTimeout.calledOnce);
    });

    it('sets a timeout', function() {
      const l = new Loader(store);
      l.schedule();
      assert.ok(timers.setTimeout.calledOnce);
    });

    it('calls loadExperiments in the callback', function() {
      timers.setTimeout.callsArg(0);
      const s = {
        dispatch: sinon.spy(),
        getState: sinon.stub().returns({ env: 'test', baseUrl: 'foo' })
      };
      const l = new Loader(s);
      sinon.spy(l, 'loadExperiments');
      l.schedule();
      assert.ok(l.loadExperiments.calledOnce);
      l.loadExperiments.restore();
    });
  });

  describe('loadExperiments', function() {
    it('dispatches EXPERIMENTS_LOADED on success', function(done) {
      const s = {
        dispatch: sinon.spy(),
        getState: sinon
          .stub()
          .returns({ experiments: {}, ui: { clicked: Date.now() } })
      };
      const l = new Loader(s);
      l.loadExperiments('test', 'foo').then(
        () => {
          assert.ok(s.dispatch.calledTwice);
          assert.equal(s.dispatch.firstCall.args[0].type, MAYBE_NOTIFY.type);
          assert.equal(
            s.dispatch.secondCall.args[0].type,
            EXPERIMENTS_LOADED.type
          );
          done();
        },
        () => assert.fail()
      );
    });

    it('dispatches EXPERIMENT_LOAD_ERROR when the fetch fails', function(done) {
      const l = new Loader(store);
      res.status = 404;
      l.loadExperiments('test', 'foo').then(
        () => {
          assert.ok(store.dispatch.calledOnce);
          assert.equal(
            store.dispatch.firstCall.args[0].type,
            EXPERIMENTS_LOAD_ERROR.type
          );
          done();
        },
        () => assert.fail()
      );
    });

    it('dispatches SET_BADGE when experiment is new', function(done) {
      const s = {
        dispatch: sinon.spy(),
        getState: sinon.stub().returns({ experiments: {}, ui: { clicked: 1 } })
      };
      const l = new Loader(s);
      l.loadExperiments('test', 'foo').then(
        () => {
          assert.ok(s.dispatch.calledThrice);
          assert.equal(s.dispatch.firstCall.args[0].type, SET_BADGE.type);
          assert.equal(s.dispatch.secondCall.args[0].type, MAYBE_NOTIFY.type);
          assert.equal(
            s.dispatch.thirdCall.args[0].type,
            EXPERIMENTS_LOADED.type
          );
          done();
        },
        () => assert.fail()
      );
    });

    it('calls WebExtensionChannel.add on active experiments', function(done) {
      const s = {
        dispatch: sinon.spy(),
        getState: sinon
          .stub()
          .returns({ experiments: {}, ui: { clicked: Date.now() } })
      };
      const l = new Loader(s);
      l.loadExperiments('test', 'foo').then(
        () => {
          assert.ok(xadd.calledOnce);
          assert.ok(xadd.calledWith(x.addon_id));
          done();
        },
        () => assert.fail()
      );
    });

    it(
      'does not call WebExtensionChannel.add on inactive experiments',
      function(done) {
        AddonManager.getAllAddons.callsArgWith(0, [
          { id: 'x', isActive: false, installDate: new Date() }
        ]);
        const s = {
          dispatch: sinon.spy(),
          getState: sinon
            .stub()
            .returns({ experiments: {}, ui: { clicked: Date.now() } })
        };
        const l = new Loader(s);
        l.loadExperiments('test', 'foo').then(
          () => {
            assert.ok(!xadd.called);
            x.active = true;
            done();
          },
          () => assert.fail()
        );
      }
    );
  });
});
