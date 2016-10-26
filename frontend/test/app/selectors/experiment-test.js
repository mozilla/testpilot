import { assert } from 'chai';
import moment from 'moment';

import experimentSelector, {
  allExperimentSelector,
  launchedExperimentSelector,
  l10nSelector,
  localeSelector,
  onlyLaunchedExperimentSelector,
} from '../../../src/app/selectors/experiment';


describe('app/selectors/experiment', () => {

  describe('launch date-related selectors', () => {

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

    describe('onlyLaunchedExperimentSelector', () => {
      it('should exclude experiments with launch dates in the future', () => {
        const store = _store(_exp);
        assert.deepEqual(
          onlyLaunchedExperimentSelector(store),
          [_exp[0], _exp[2]]
        );
      });
    });

    describe('launchedExperimentSelector', () => {
      it('should use allExperimentSelector if dev', () => {
        const store = _store(_exp, true);
        assert.deepEqual(
          allExperimentSelector(store),
          launchedExperimentSelector(store)
        );
      });

      it('should use onlyLaunchedExperimentSelector if not dev', () => {
        const store = _store(_exp, false);
        assert.deepEqual(
          onlyLaunchedExperimentSelector(store),
          launchedExperimentSelector(store)
        );
      });
    });

  });

  describe('language-related selectors', () => {

    const BLOCKED_LANG = 'piglatin';
    const GRANTED_LANG = 'piratespeak';
    const OTHER_LANG = 'klingon';

    describe('localeSelector', () => {
      const store = {
        browser: {
          locale: BLOCKED_LANG
        }
      };

      it('should filter to store.browser.locale', () => {
        assert.equal(
          BLOCKED_LANG,
          localeSelector(store)
        );
      });
    });

    describe('l10nSelector', () => {
      const experiments = [
        { order: 1 },
        { order: 2, locale_blocklist: [ BLOCKED_LANG ] },
        { order: 3, locale_grantlist: [ GRANTED_LANG ] }
      ];

      it('filters experiments blocklisted for the locale', () => {
        assert.deepEqual(
          l10nSelector(BLOCKED_LANG, experiments),
          [experiments[0]]
        );
      });

      it('filters experiments grantlisted for other locales', () => {
        assert.deepEqual(
          l10nSelector(OTHER_LANG, experiments),
          [experiments[0], experiments[1]]
        );
      });

      it('keeps experiments grantlisted for the locale', () => {
        assert.deepEqual(
          l10nSelector(GRANTED_LANG, experiments),
          experiments
        );
      });
    });

  });

});
