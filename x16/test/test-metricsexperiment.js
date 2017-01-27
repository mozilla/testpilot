/* global describe beforeEach it */
import assert from 'assert';
import proxyquire from 'proxyquire';
import sinon from 'sinon';

import Variants from '../src/lib/metrics/variants';

const EVENT_SEND_METRIC = 'testpilot::send-metric';
const EVENT_RECEIVE_VARIANT_DEFS = 'testpilot::register-variants';
const EVENT_SEND_VARIANTS = 'testpilot::receive-variants';

const AddonManager = {
  getAddonByID: sinon.stub().callsArgWith(1, { version: '0' })
};

const Events = {
  emit: sinon.spy(),
  on: sinon.spy(),
  off: sinon.spy(),
  '@noCallThru': true
};
const Services = {
  startup: { getStartupInfo: sinon.stub().returns({ process: new Date() }) }
};
const storage = {};
const TelemetryController = { submitExternalPing: sinon.spy() };

const Experiment = proxyquire('../src/lib/metrics/experiment', {
  'resource://gre/modules/AddonManager.jsm': {
    AddonManager,
    '@noCallThru': true
  },
  'sdk/system/events': Events,
  'sdk/self': { id: 'self-id', '@noCallThru': true },
  'resource://gre/modules/Services.jsm': { Services, '@noCallThru': true },
  'sdk/simple-storage': { storage, '@noCallThru': true },
  'resource://gre/modules/TelemetryController.jsm': {
    TelemetryController,
    '@noCallThru': true
  }
}).default;

describe('Experiment', function() {
  beforeEach(function() {
    AddonManager.getAddonByID.reset();
    Events.emit.reset();
    Events.on.reset();
    Events.off.reset();
    Services.startup.getStartupInfo.reset();
    TelemetryController.submitExternalPing.reset();
    Object.keys(storage).forEach(k => {
      delete storage[k];
    });
  });

  it('initializes', function() {
    const x = new Experiment();
    assert.ok(Events.on.calledTwice);
    assert.ok(Events.on.calledWith(EVENT_SEND_METRIC));
    assert.ok(Events.on.calledWith(EVENT_RECEIVE_VARIANT_DEFS));
    assert.equal(typeof x.receiveVariantDefs, 'function');
  });

  it('tears down', function() {
    const x = new Experiment();
    x.teardown();
    assert.ok(Events.off.calledTwice);
    assert.ok(Events.off.calledWith(EVENT_SEND_METRIC));
    assert.ok(Events.off.calledWith(EVENT_RECEIVE_VARIANT_DEFS));
  });

  describe('ping', function() {
    it('submits to telemetry', function() {
      Experiment.ping({ subject: 'test', data: '{}' });
      assert.ok(TelemetryController.submitExternalPing.calledOnce);
      assert.ok(
        TelemetryController.submitExternalPing.calledWith('testpilottest')
      );
    });

    it('sends variants if present', function() {
      storage.experimentVariants = { test: 'foo' };
      Experiment.ping({ subject: 'test', data: '{}' });
      assert.equal(
        TelemetryController.submitExternalPing.firstCall.args[1].variants,
        'foo'
      );
    });
  });

  describe('receiveVariantDefs', function() {
    it('emits EVENT_SEND_VARIANTS', function() {
      const x = new Experiment(new Variants('test-uuid'));
      x.receiveVariantDefs({ subject: 'test', data: '{}' });
      assert.ok(Events.emit.calledOnce);
      assert.ok(Events.emit.calledWith(EVENT_SEND_VARIANTS));
    });
  });
});
