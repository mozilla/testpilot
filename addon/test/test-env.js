/* global describe beforeEach it */
import assert from 'assert';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import { CHANGE_ENV } from '../src/lib/actions';
import environments from '../src/lib/environments';

const prefs = { on: sinon.spy() };
const PrefsTarget = sinon.stub().returns(prefs);

const aboutConfig = {
  get: sinon.stub(),
  has: sinon.stub().returns(false),
  set: sinon.spy(),
  '@noCallThru': true
};

const env = proxyquire('../src/lib/actionCreators/env', {
  'sdk/self': { id: 'self_id', '@noCallThru': true },
  'sdk/preferences/service': aboutConfig,
  'sdk/preferences/event-target': { PrefsTarget, '@noCallThru': true }
}).default;

describe('env', function() {
  beforeEach(function() {
    aboutConfig.get.returns('anything-but-production');
    aboutConfig.get.reset();
  });

  it('initializes', function() {
    assert.ok(aboutConfig.set.calledTwice);
    assert.ok(
      aboutConfig.set.firstCall.calledWith('testpilot.env', 'production')
    );
    assert.ok(
      aboutConfig.set.secondCall.calledWith(
        'extensions.self_id.sdk.console.logLevel',
        'debug'
      )
    );
    assert.ok(prefs.on.calledOnce);
    assert.ok(prefs.on.calledWith('testpilot.env'));
  });

  describe('get', function() {
    it('defaults to production', function() {
      aboutConfig.get.returns('production');
      const e = env.get();
      assert.equal(e, environments['production']);
    });

    it('returns production if environment is unknown', function() {
      const e = env.get();
      assert.equal(e, environments['production']);
    });

    it('returns the environment from about:config', function() {
      aboutConfig.get.returns('any');
      const e = env.get();
      assert.equal(e, environments['any']);
    });
  });

  describe('subscribe', function() {
    it('sets the dispatch function', function() {
      const fn = prefs.on.firstCall.args[1];
      sinon.stub(console, 'error');
      fn();
      assert.ok(console.error.calledOnce);

      const s = { dispatch: sinon.spy() };
      env.subscribe(s);
      fn();
      assert.ok(console.error.calledOnce);
      assert.ok(s.dispatch.calledOnce);
      assert.equal(s.dispatch.firstCall.args[0].type, CHANGE_ENV.type);
      console.error.restore();
    });
  });
});
