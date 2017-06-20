import { expect } from 'chai';
import moment from 'moment';

import newsUpdatesSelector from '../../../src/app/selectors/news';

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
        const exp1 = store.experiments.data.filter(experiment => experiment.slug === 'exp1')[0];
        exp1.launch_date = moment().add(7, 'days');
        store.browser.isDev = isDev;
        return store;
      }

      const resultNonDev = experimentSlugsSet(newsUpdatesSelector(store(false)));
      expect(resultNonDev.has('exp1')).to.be.false;

      const resultDev = experimentSlugsSet(newsUpdatesSelector(store(true)));
      expect(resultDev.has('exp1')).to.be.true;
    });

    it('should include updates published in the future only in dev environment', () => {
      function store(isDev) {
        const store = makeStore();
        store.browser.isDev = isDev;
        return store;
      }

      const resultNonDev = titleSet(newsUpdatesSelector(store(false)));
      expect(resultNonDev.has('Exp1 future update')).to.be.false;

      const resultDev = titleSet(newsUpdatesSelector(store(true)));
      expect(resultDev.has('Exp1 future update')).to.be.true;
    });

    it('should include Test Pilot general updates', () => {
      const result = newsUpdatesSelector(makeStore())
        .filter(update => !update.experimentSlug)
        .map(update => update.title);
      expect(result).to.deep.equal([
        'Test Pilot Item 2',
        'Test Pilot Item 1'
      ]);
    });

    it('should sort news updates in reverse-chronological order', () => {
      const result = newsUpdatesSelector(makeStore())
        .map(update => update.created);
      expect(result).to.deep.equal([
        "2017-06-02T12:00:00Z",
        "2017-06-01T12:00:00Z",
        '2017-05-30T12:00:00Z',
        '2017-05-29T12:00:00Z',
        '2017-05-28T13:00:00Z',
        '2017-05-17T13:00:00Z'
      ]);
    });

  });

});

const titleSet = updates =>
  new Set(updates.map(update => update.title));

const experimentSlugsSet = updates =>
  new Set(updates.map(update => update.experimentSlug));

const makeStore = () => ({
  browser: {
    isDev: false
  },
  experiments: {
    data: [
      { slug: 'exp1' },
      { slug: 'exp2' }
    ]
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
      },
    ]
  }
});
