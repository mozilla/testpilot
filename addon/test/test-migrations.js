/* global describe it */
import assert from 'assert';
import { migrate } from '../src/lib/migrations';

describe('migrate', function() {
  it('defaults to an empty object', function() {
    assert.equal(Object.keys(migrate({})).length, 0);
  });

  it('copies store.root when available', function() {
    const store = { root: { clientUUID: 'test', what: 'ever', else: true } };
    const copy = migrate(store);
    assert.deepEqual(store.root, copy);
  });

  it('copies old clientUUID', function() {
    const old = { clientUUID: 'test' };
    const neu = migrate(old);
    assert.equal(old.clientUUID, neu.clientUUID);
  });

  it('converts surveyChecks', function() {
    const old = {
      clientUUID: 'test',
      surveyChecks: { twoDaysSent: { x: true } }
    };
    const neu = migrate(old);
    assert.deepEqual(neu.ratings.x, { '2': true, rating: -1 });
  });

  it('converts sharePrompt', function() {
    const old = { clientUUID: 'test', sharePrompt: { hasBeenShown: true } };
    const neu = migrate(old);
    assert.equal(neu.ui.shareShown, true);
  });
});
