/* global describe beforeEach it */
import assert from 'assert';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import * as actions from '../src/lib/actions';

const addon = { uninstall: sinon.spy() };

const install = { addListener: sinon.spy(), install: sinon.spy() };

const AddonManager = {
  getAllAddons: sinon.stub().callsArgWith(0, [ addon ]),
  getAddonByID: sinon.stub().callsArgWith(1, addon),
  getInstallForURL: sinon.stub().callsArgWith(1, install)
};

const store = { dispatch: sinon.spy(), getState: sinon.spy() };
const InstallManager = proxyquire('../src/lib/actionCreators/InstallManager', {
  'resource://gre/modules/AddonManager.jsm': {
    AddonManager,
    '@noCallThru': true
  },
  'sdk/self': { id: 'self_id', '@noCallThru': true }
}).default;

describe('InstallManager', function() {
  beforeEach(function() {
    AddonManager.getAddonByID.reset();
    AddonManager.getInstallForURL.reset();
    store.dispatch.reset();
    store.getState.reset();
    install.addListener.reset();
    install.install.reset();
    addon.uninstall.reset();
  });

  it('initializes', function() {
    const i = new InstallManager(store);
    assert.equal(i.store, store);
  });

  describe('uninstallExperiment', function() {
    it('uninstalls experiments', function() {
      const i = new InstallManager(store);
      i.uninstallExperiment({ addon_id: 'x' });
      assert.ok(addon.uninstall.calledOnce);
    });

    it('does nothing with non-existant addons', function() {
      AddonManager.getAddonByID.callsArgWith(1, null);
      const i = new InstallManager(store);
      i.uninstallExperiment({ addon_id: 'x' });
      assert.ok(!addon.uninstall.called);
      AddonManager.getAddonByID.callsArgWith(1, addon);
    });
  });

  describe('installExperiment', function() {
    it('adds an install listener', function() {
      const x = { xpi_url: 'x' };
      const i = new InstallManager(store);
      i.installExperiment(x);
      assert.ok(install.addListener.calledOnce);
      assert.equal(install.addListener.firstCall.args[0].experiment, x);
    });

    it('begins the install', function() {
      const x = { xpi_url: 'x' };
      const i = new InstallManager(store);
      i.installExperiment(x);
      assert.ok(install.install.calledOnce);
    });
  });

  describe('uninstallAll', function() {
    it('uninstalls active experiments', function() {
      const x = { addon_id: 'x', active: true };
      const y = { addon_id: 'y', active: false };
      const state = { experiments: { x, y } };
      const s = { getState: sinon.stub().returns(state) };
      const i = new InstallManager(s);
      i.uninstallAll();
      assert.ok(AddonManager.getAddonByID.calledOnce);
      assert.ok(AddonManager.getAddonByID.firstCall.calledWith(x.addon_id));
      assert.ok(addon.uninstall.calledOnce);
    });
  });

  describe('uninstallSelf', function() {
    it('uninstalls... wait for it... self', function() {
      const i = new InstallManager(store);
      i.uninstallSelf();
      assert.ok(AddonManager.getAddonByID.calledOnce);
      assert.ok(AddonManager.getAddonByID.calledWith('self_id'));
      assert.ok(addon.uninstall.calledOnce);
    });
  });

  describe('syncInstalled', function() {
    it('dispatches SYNC_INSTALLED', function() {
      const s = {
        dispatch: sinon.spy(),
        getState: sinon.stub().returns({ experiments: {} })
      };
      const i = new InstallManager(s);
      i.syncInstalled();
      assert.ok(s.dispatch.calledOnce);
      assert.equal(
        s.dispatch.firstCall.args[0].type,
        actions.SYNC_INSTALLED.type
      );
    });
  });
});
