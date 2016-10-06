import { assert } from 'chai';
import moment from 'moment';

import experimentSelector, { allExperimentSelector, launchedExperimentSelector } from '../../../src/app/selectors/experiment';

describe('app/selectors/experiment', () => {
  const _store = (experiments, isDev = false) => ({
    browser: { isDev: isDev },
    experiments: { data: experiments }
  });
  const _exp = [
    { name: 'foo', order: 1 },
    { name: 'baz', order: 3, launch_date: moment.utc() + 99999 },
    { name: 'bat', order: 2, launch_date: moment.utc() - 99999 }
  ];

  describe('allExperimentSelector', () => {
    it('should filter to store.experiments.data', () => {
      const store = _store([_exp[0]]);
      assert.deepEqual(
        allExperimentSelector(store),
        store.experiments.data
      );
    });

    it('should sort based on the set order', () => {
      const store = _store(_exp);
      assert.deepEqual(
        allExperimentSelector(store),
        [_exp[0], _exp[2], _exp[1]]
      );
    });
  });


  describe('launchedExperimentSelector', () => {
    it('should exclude experiments with launch dates in the future', () => {
      const store = _store(_exp);
      assert.deepEqual(
        launchedExperimentSelector(store),
        [_exp[0], _exp[2]]
      );
    });
  });


  describe('experimentSelector', () => {
    it('should use allExperimentSelector if dev', () => {
      const store = _store(_exp, true);
      assert.deepEqual(
        allExperimentSelector(store),
        experimentSelector(store)
      );
    });

    it('should use launchedExperimentSelector if not dev', () => {
      const store = _store(_exp, false);
      assert.deepEqual(
        launchedExperimentSelector(store),
        experimentSelector(store)
      );
    });
  });

});
