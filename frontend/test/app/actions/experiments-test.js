
import { expect } from 'chai';
import fetchMock from 'fetch-mock';
import config from '../../../src/app/config';
import sinon from 'sinon';

const USAGE_COUNTS = {count: 50};

describe('app/actions/experiments/setInstalled', () => {
  let dispatch;
  let fetchUserCounts;

  beforeEach(() => {
    fetchMock.get(config.usageCountsURL, USAGE_COUNTS);
    dispatch = sinon.spy(),
    fetchUserCounts = require('../../../src/app/actions/experiments').default.fetchUserCounts
  });

  afterEach(() => {
    fetchMock.restore();
  });

  it('should be able to fetch the user counts', (done) => {
    fetchUserCounts(config.usageCountsURL).then(result => {
      try {
        expect(JSON.stringify(result)).to.equal(JSON.stringify({
          type: 'FETCH_USER_COUNTS',
          payload: USAGE_COUNTS
        }));
      } catch (e) {
        return done(e);
      }
      done();
    });
  });
})
