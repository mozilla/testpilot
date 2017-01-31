/* global describe beforeEach it */
import assert from 'assert';
import sinon from 'sinon';
import Hub from '../src/lib/middleware/Hub';
import { GET_INSTALLED, SYNC_INSTALLED } from '../src/lib/actions';

const store = { dispatch: sinon.spy(), getState: sinon.spy() };

describe('Hub', function() {
  beforeEach(function() {
    store.dispatch.reset();
    store.getState.reset();
  });

  it('initializes', function() {
    const h = new Hub();
    assert.equal(h.ports.size, 0);
  });

  it('logs on misuse of dispatch', function() {
    sinon.stub(console, 'error');
    const h = new Hub();
    h.dispatch('foo');
    assert.ok(console.error.calledOnce);
    console.error.restore();
  });

  it('connects the proper events', function() {
    const h = new Hub();
    const p = { on: sinon.spy() };
    h.connect(p);
    assert.ok(p.on.calledTwice);
    assert.ok(p.on.calledWith('action'));
    assert.ok(p.on.calledWith('from-web-to-addon'));
    assert.equal(h.ports.size, 1);
  });

  it('disconnects events', function() {
    const h = new Hub();
    const p = { on: sinon.spy(), off: sinon.spy() };
    h.connect(p);
    assert.equal(h.ports.size, 1);
    h.disconnect(p);
    assert.ok(p.off.calledTwice);
    assert.ok(p.off.calledWith('action'));
    assert.ok(p.off.calledWith('from-web-to-addon'));
    assert.equal(h.ports.size, 0);
  });

  it('emits actions using middleware', function(done) {
    const h = new Hub();
    const p = { on: sinon.spy(), emit: sinon.spy() };
    h.connect(p);
    const middleware = h.middleware();
    const a = { type: 'test' };
    const next = action => {
      assert.ok(p.emit.calledOnce);
      assert.ok(p.emit.calledWith('action', a));
      assert.equal(a.meta.src, 'addon');
      assert.equal(action, a);
      done();
    };
    middleware(store)(next)(a);
  });

  it('does not re-emit frontend actions', function(done) {
    const h = new Hub();
    const p = { on: sinon.spy(), emit: sinon.spy() };
    h.connect(p);
    const middleware = h.middleware();
    const a = { type: 'test', meta: { src: 'frontend' } };
    const next = action => {
      assert.ok(!p.emit.called);
      assert.equal(action, a);
      done();
    };
    middleware(store)(next)(a);
  });

  it('emits web actions when needed', function(done) {
    const h = new Hub();
    const p = { on: sinon.spy(), emit: sinon.spy() };
    h.connect(p);
    const middleware = h.middleware();
    const a = {
      type: SYNC_INSTALLED.type,
      payload: { clientUUID: 'clientUUID', installed: [] }
    };
    const next = action => {
      assert.ok(p.emit.calledTwice);
      assert.ok(p.emit.calledWith('action', a));
      assert.ok(p.emit.calledWith('from-addon-to-web'));
      assert.equal(action, a);
      done();
    };
    middleware(store)(next)(a);
  });

  it('translates web events to actions', function() {
    const h = new Hub();
    h.dispatch = sinon.spy();
    const event = { type: 'sync-installed', data: 'test' };
    const on = sinon.stub();
    on.withArgs('from-web-to-addon').callsArgWith(1, event);

    const p = { on };
    h.connect(p);
    assert.ok(h.dispatch.calledOnce);
    assert.equal(h.dispatch.firstCall.args[0].type, GET_INSTALLED.type);
  });

  it('removes the port on emit failure', function(done) {
    const h = new Hub();
    const p = {
      on: sinon.spy(),
      emit: () => {
        throw new Error('test');
      }
    };
    h.connect(p);
    const middleware = h.middleware();
    const a = { type: 'test' };
    const next = action => {
      assert.equal(h.ports.size, 0);
      done();
    };
    middleware(store)(next)(a);
  });
});
