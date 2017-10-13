import { expect } from 'chai';
import moment from 'moment';

import newsUpdatesSelector, {
  staleNewsUpdatesSelector,
  freshNewsUpdatesSelector
} from '../../../src/app/selectors/news';

describe('app/selectors/news', () => {
  describe('newsUpdatesSelector', () => {
    it('should gather available news updates from all available experiments', () => {
      const result = experimentSlugsSet(newsUpdatesSelector(makeStore()));
      expect(result.has('exp1')).to.be.true;
      expect(result.has('exp2')).to.be.true;
      expect(result.has('exp3')).to.be.false;
    });

    it('should include updates from a pre-launch experiment only in dev environment', () => {
      function store(isDev) {
        const store = makeStore();
        const exp1 = store.experiments.data.filter(
          experiment => experiment.slug === 'exp1'
        )[0];
        exp1.launch_date = moment().add(7, 'days');
        store.browser.isDev = isDev;
        return store;
      }

      const resultNonDev = experimentSlugsSet(
        newsUpdatesSelector(store(false))
      );
      expect(resultNonDev.has('exp1')).to.be.false;

      const resultDev = experimentSlugsSet(newsUpdatesSelector(store(true)));
      expect(resultDev.has('exp1')).to.be.true;
    });

    it('should include Test Pilot general updates', () => {
      const result = newsUpdatesSelector(makeStore())
        .filter(update => !update.experimentSlug)
        .map(update => update.title);
      expect(result).to.deep.equal(['Test Pilot Item 2', 'Test Pilot Item 1']);
    });

    it('should sort news updates in reverse-chronological order', () => {
      const result = newsUpdatesSelector(makeStore()).map(
        update => update.created
      );
      expect(result).to.deep.equal([
        '2017-06-02T12:00:00Z',
        '2017-06-01T12:00:00Z',
        '2017-05-30T12:00:00Z',
        '2017-05-29T12:00:00Z',
        '2017-05-28T13:00:00Z',
        '2017-05-17T13:00:00Z'
      ]);
    });
  });

  const makeNewsUpdateSelectorAgeTest = useStale => () => {
    const today = Date.now();
    const twoWeeksAgo = today - 2 * 7 * 24 * 60 * 60 * 1000;
    const store = makeStore();
    const updates = store.news.updates;
    const freshCount = 4;

    for (let i = 0; i < updates.length; i++) {
      // HACK: Since this is time dependent, give this a couple seconds of
      // wiggle room around the two-week mark
      let dt;
      if (i < freshCount) {
        dt = [today, twoWeeksAgo + 2000][i % 2];
      } else {
        dt = twoWeeksAgo - 2000;
      }
      const key = ['published', 'created'][i % 2];
      updates[i][key] = new Date(dt).toISOString();
    }

    const selector = useStale
      ? staleNewsUpdatesSelector
      : freshNewsUpdatesSelector;

    // Filter result to assert no updates contradict the selector
    const shouldBeEmpty = selector(store)
      .map(update => new Date(update.published || update.created).getTime())
      .filter(
        dt =>
          useStale
            ? dt >= twoWeeksAgo // fresh news from stale selector is a failure
            : dt < twoWeeksAgo // stale news from fresh selector is a failure
      );

    // An empty list should be the end result.
    expect(shouldBeEmpty).to.have.property('length', 0);
  };

  describe('freshNewsUpdatesSelector', () => {
    it(
      'should only produce updates within the last 2 weeks',
      makeNewsUpdateSelectorAgeTest(false)
    );
  });

  describe('staleNewsUpdatesSelector', () => {
    it(
      'should only produce updates older than 2 weeks',
      makeNewsUpdateSelectorAgeTest(true)
    );
  });
});

const titleSet = updates => new Set(updates.map(update => update.title));

const experimentSlugsSet = updates =>
  new Set(updates.map(update => update.experimentSlug));

const makeStore = () => ({
  browser: {
    isDev: false
  },
  experiments: {
    data: [{ slug: 'exp1' }, { slug: 'exp2' }]
  },
  news: {
    updates: [
      {
        created: '2017-06-01T12:00:00Z',
        title: 'Test Pilot Item 1'
      },
      {
        created: '2017-06-02T12:00:00Z',
        title: 'Test Pilot Item 2'
      },
      {
        experimentSlug: 'exp1',
        created: '2017-05-29T12:00:00Z',
        title: 'Exp1 News Item 1'
      },
      {
        experimentSlug: 'exp1',
        created: '2017-05-28T13:00:00Z',
        title: 'Exp1 News Item 2'
      },
      {
        experimentSlug: 'exp1',
        created: '2017-05-28T13:00:00Z',
        published: '2099-10-24T12:12:12Z',
        title: 'Exp1 future update'
      },
      {
        experimentSlug: 'exp2',
        created: '2017-05-30T12:00:00Z',
        title: 'Exp2 News Item 1'
      },
      {
        experimentSlug: 'exp2',
        created: '2017-05-17T13:00:00Z',
        title: 'Exp2 News Item 2'
      },
      {
        experimentSlug: 'exp3',
        created: '2017-05-30T12:00:00Z',
        title: 'Exp3 News Item 1'
      },
      {
        experimentSlug: 'exp3',
        created: '2017-05-17T13:00:00Z',
        title: 'Exp3 News Item 2'
      }
    ]
  }
});
