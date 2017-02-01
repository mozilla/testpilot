/* global describe beforeEach it */
import assert from 'assert';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import { EXPERIMENT_ENABLED, EXPERIMENT_DISABLED } from '../src/lib/actions';

const AddonManager = {
  addAddonListener: sinon.spy(),
  removeAddonListener: sinon.spy(),
  PENDING_ENABLE: 1
};

const store = { dispatch: sinon.spy(), getState: sinon.spy() };
const AddonListener = proxyquire('../src/lib/actionCreators/AddonListener', {
  'resource://gre/modules/AddonManager.jsm': {
    AddonManager,
    '@noCallThru': true
  }
}).default;

describe('AddonListener', function() {
  beforeEach(function() {
    AddonManager.addAddonListener.reset();
    AddonManager.removeAddonListener.reset();
    store.dispatch.reset();
    store.getState.reset();
  });

  it('initializes', function() {
    const l = new AddonListener(store);
    assert.ok(AddonManager.addAddonListener.calledOnce);
    assert.ok(AddonManager.addAddonListener.calledWith(l));
    assert.equal(l.dispatch, store.dispatch);
  });

  describe('event listeners', function() {
    function testListeners(addon) {
      const x = {};
      const s = {
        dispatch: sinon.spy(),
        getState: sinon.stub().returns({ experiments: { x } })
      };
      const listeners = new Map([
        [ 'onEnabled', 'EXPERIMENT_ENABLED' ],
        [ 'onDisabled', 'EXPERIMENT_DISABLED' ],
        [ 'onUninstalling', 'EXPERIMENT_UNINSTALLING' ],
        [ 'onUninstalled', 'EXPERIMENT_UNINSTALLED' ]
      ]);
      const listener = new AddonListener(s);

      // eslint-disable-next-line prefer-const
      for (let [ event, action ] of listeners) {
        listener[event](addon);
        if (addon.id === 'x') {
          assert.ok(s.dispatch.calledOnce);
          assert.equal(s.dispatch.firstCall.args[0].type, action);
        } else {
          assert.ok(s.dispatch.calledOnce);
          assert.ok(s.dispatch.firstCall.args[0].type, 'ADDONS_CHANGED');
        }
        s.dispatch.reset();
      }
    }

    it('dispatches actions when the addon is an experiment', function() {
      testListeners({ id: 'x' });
    });

    it('does not dispatch when the addon is not an experiment', function() {
      testListeners({ id: 'y' });
    });

    it('calls AddonManager.removeAddonListener on teardown', function() {
      const l = new AddonListener(store);
      l.teardown();
      assert.ok(AddonManager.removeAddonListener.calledOnce);
      assert.ok(AddonManager.removeAddonListener.calledWith(l));
    });

    describe('onOperationCancelled', function() {
      it(
        'dispatches EXPERIMENT_ENABLED when addon has a pending enable',
        function() {
          const x = {};
          const s = {
            dispatch: sinon.spy(),
            getState: sinon.stub().returns({ experiments: { x } })
          };
          const l = new AddonListener(s);
          l.onOperationCancelled({ id: 'x', pendingOperations: 1 });
          assert.ok(s.dispatch.calledOnce);
          assert.equal(
            s.dispatch.firstCall.args[0].type,
            EXPERIMENT_ENABLED.type
          );
        }
      );

      it(
        'dispatches EXPERIMENT_DISABLED when addon is userDisabled and installed',
        function() {
          const x = {};
          const s = {
            dispatch: sinon.spy(),
            getState: sinon.stub().returns({ experiments: { x } })
          };
          const l = new AddonListener(s);
          l.onOperationCancelled({
            id: 'x',
            userDisabled: true,
            installDate: new Date()
          });
          assert.ok(s.dispatch.calledOnce);
          assert.equal(
            s.dispatch.firstCall.args[0].type,
            EXPERIMENT_DISABLED.type
          );
        }
      );
    });
  });
});
