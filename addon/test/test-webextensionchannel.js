/* global describe beforeEach it */
import assert from 'assert';
import proxyquire from 'proxyquire';
import sinon from 'sinon';

const broadcastChannel = {
  addEventListener: sinon.spy(),
  removeEventListener: sinon.spy(),
  close: sinon.spy()
};

const window = { BroadcastChannel: sinon.stub().returns(broadcastChannel) };

const docShell = {
  createAboutBlankContentViewer: sinon.spy(),
  contentViewer: { DOMDocument: { defaultView: window } }
};

const getInterface = { getInterface: sinon.stub().returns(docShell) };

const addonChromeWebNav = {
  QueryInterface: sinon.stub().returns(getInterface),
  close: sinon.spy()
};

const Ci = { nsIInterfaceRequestor: 'sure', nsIDocShell: 'whatever' };
const Services = {
  io: { newURI: sinon.stub().returns('baseURI://ok') },
  scriptSecurityManager: { createCodebasePrincipal: sinon.stub() },
  appShell: { createWindowlessBrowser: sinon.stub().returns(addonChromeWebNav) }
};
const getExtensionUUID = sinon.stub().returns('test-uuid');
const Experiment = { ping: sinon.spy(), '@noCallThru': true };

const WebExtensionChannel = proxyquire(
  '../src/lib/metrics/webextension-channels',
  {
    chrome: { Ci, '@noCallThru': true },
    'resource://gre/modules/Services.jsm': { Services, '@noCallThru': true },
    'resource://gre/modules/Extension.jsm': {
      getExtensionUUID,
      '@noCallThru': true
    },
    './experiment': Experiment
  }
).default;

describe('WebExtensionChannel', function() {
  beforeEach(function() {
    Experiment.ping.reset();
    WebExtensionChannel.channels.clear();
    broadcastChannel.addEventListener.reset();
    broadcastChannel.removeEventListener.reset();
    broadcastChannel.close.reset();
    addonChromeWebNav.close.reset();
  });

  it('initializes', function() {
    const w = new WebExtensionChannel('foo');
    assert.equal(w.pingListeners.size, 0);
    assert.equal(w.targetAddonId, 'foo');
    assert.equal(w.addonChromeWebNav, addonChromeWebNav);
    assert.equal(w.addonBroadcastChannel, broadcastChannel);
    assert.ok(broadcastChannel.addEventListener.calledOnce);
    assert.ok(broadcastChannel.addEventListener.calledWith('message'));
    assert.equal(typeof w.handleEvent, 'function');
  });

  it('disposes', function() {
    const w = new WebExtensionChannel('foo');
    w.dispose();
    assert.ok(broadcastChannel.removeEventListener.calledOnce);
    assert.ok(broadcastChannel.removeEventListener.calledWith('message'));
    assert.ok(broadcastChannel.close.calledOnce);
    assert.ok(addonChromeWebNav.close.calledOnce);
    assert.equal(w.pingListeners.size, 0);
    assert.equal(w.addonBroadcastChannel, null);
    assert.equal(w.addonChromeWebDeve, null);
  });

  describe('add', function() {
    it('creates a channel once', function() {
      WebExtensionChannel.add('foo');
      assert.equal(WebExtensionChannel.channels.size, 1);
      WebExtensionChannel.add('foo');
      assert.equal(WebExtensionChannel.channels.size, 1);
      const c = WebExtensionChannel.channels.get('foo');
      assert.equal(c.targetAddonId, 'foo');
    });

    it('creates a ping listener that calls Experiment.ping', function() {
      WebExtensionChannel.add('foo');
      const c = WebExtensionChannel.channels.get('foo');
      c.notifyPing('x', { addonId: 'y' });
      assert.ok(Experiment.ping.calledOnce);
    });
  });

  describe('remove', function() {
    it('disposes and deletes the channel', function() {
      WebExtensionChannel.add('foo');
      assert.equal(WebExtensionChannel.channels.size, 1);
      const c = WebExtensionChannel.channels.get('foo');
      sinon.spy(c, 'dispose');
      WebExtensionChannel.remove('foo');
      assert.equal(WebExtensionChannel.channels.size, 0);
      assert.ok(c.dispose.calledOnce);
    });
    it('does nothing with unknown ids', function() {
      assert.equal(WebExtensionChannel.channels.size, 0);
      WebExtensionChannel.remove('foo');
      assert.equal(WebExtensionChannel.channels.size, 0);
    });
  });

  describe('destroy', function() {
    it('removes all channels', function() {
      WebExtensionChannel.add('foo');
      WebExtensionChannel.add('bar');
      WebExtensionChannel.add('baz');
      assert.equal(WebExtensionChannel.channels.size, 3);
      WebExtensionChannel.destroy();
      assert.equal(WebExtensionChannel.channels.size, 0);
    });
  });

  describe('registerPingListener', function() {
    it('adds the listener to the set', function() {
      const w = new WebExtensionChannel('foo');
      const fn = sinon.spy();
      w.registerPingListener(fn);
      assert.equal(w.pingListeners.size, 1);
      assert.ok(w.pingListeners.has(fn));
    });
  });

  describe('unregisterPingListener', function() {
    it('removes the listener from the set', function() {
      const w = new WebExtensionChannel('foo');
      const fn = sinon.spy();
      w.registerPingListener(fn);
      assert.equal(w.pingListeners.size, 1);
      assert.ok(w.pingListeners.has(fn));

      w.unregisterPingListener(fn);
      assert.equal(w.pingListeners.size, 0);
      assert.ok(!w.pingListeners.has(fn));
    });
  });

  describe('notifyPing', function() {
    it('calls the ping listeners with the arguments', function() {
      const w = new WebExtensionChannel('foo');
      const fn = sinon.spy();
      w.registerPingListener(fn);
      w.notifyPing('x', { addonId: 'f' });
      assert.ok(fn.calledOnce);
      assert.equal(fn.firstCall.args[0].senderAddonId, 'f');
      assert.equal(fn.firstCall.args[0].testpilotPingData, 'x');
    });

    it('catches listener exceptions', function() {
      sinon.stub(console, 'error');
      const w = new WebExtensionChannel('foo');
      const fn = sinon.stub().throws();
      w.registerPingListener(fn);
      w.notifyPing('x', { addonId: 'f' });
      assert.ok(fn.calledOnce);
      assert.ok(console.error.calledOnce);
      console.error.restore();
    });
  });

  describe('handleEvent', function() {
    it('calls notifyPing', function() {
      const w = new WebExtensionChannel('foo');
      sinon.stub(w, 'notifyPing');
      w.handleEvent({ data: 'x' });
      assert.ok(w.notifyPing.calledOnce);
      assert.ok(w.notifyPing.calledWith('x'));
    });
  });
});
