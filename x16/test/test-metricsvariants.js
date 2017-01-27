/* global describe it */
import assert from 'assert';
import proxyquire from 'proxyquire';
import sinon from 'sinon';

const seedrandom = sinon.stub().returns(() => 0.9);
const Variants = proxyquire('../src/lib/metrics/variants', {
  seedrandom
}).default;

describe('Variants', function() {
  it('initializes', function() {
    const v = new Variants('test-uuid');
    assert.equal(v.clientUUID, 'test-uuid');
  });

  describe('makeTest', function() {
    it('uses seedrandom', function() {
      const vs = [ { weight: 2, value: 'a' }, { weight: 4, value: 'b' } ];
      const v = new Variants('x');
      v.makeTest({ name: 'foo', variants: vs });
      assert.ok(seedrandom.calledOnce);
      assert.ok(seedrandom.calledWith('foo_x'));
    });

    it('returns a variant value', function() {
      const vs = [ { weight: 2, value: 'a' }, { weight: 4, value: 'b' } ];
      const v = new Variants('x');
      const x = v.makeTest({ name: 'foo', variants: vs });
      assert.equal(x, 'b');
    });
  });

  describe('parseTests', function() {
    it('returns a variant for each subject', function() {
      const vs = [ { weight: 2, value: 'a' }, { weight: 4, value: 'b' } ];
      const tests = {
        y: { name: 'y', variants: vs },
        z: { name: 'z', variants: vs }
      };
      const v = new Variants('x');
      const x = v.parseTests(tests);
      assert.deepEqual(Object.keys(x), [ 'y', 'z' ]);
      assert.equal(x.y, 'b');
      assert.equal(x.z, 'b');
    });
  });
});
