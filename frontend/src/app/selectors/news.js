import { createSelector } from 'reselect';
import moment from 'moment';
import cookies from 'js-cookie';
import experimentSelector from './experiment';

// Gathers up a reverse-chronological list of currently published news updates
// from all available experiments and Test Pilot in general
const newsUpdatesSelector = createSelector(
  store => store.news.updates,
  experimentSelector,

  (newsUpdates, experiments) => {
    const availableExperiments = new Set(experiments.map(e => e.slug));
    return newsUpdates

      // Filter for published updates and updates for available experiments,
      .filter(update => (
        (typeof update.published === 'undefined' ||
          moment(moment.utc()).isAfter(update.published)) &&
        (typeof update.experimentSlug === 'undefined' ||
          availableExperiments.has(update.experimentSlug))
      ))

      // Reverse-chronological sort
      .sort((a, b) => {
        if (b.created < a.created) {
          return -1;
        } else if (b.created > a.created) {
          return 1;
        }
        return 0;
      });
  }
);

const TWO_WEEKS = 2 * 7 * 24 * 60 * 60 * 1000;

const twoWeeksAgoSelector = () => Date.now() - TWO_WEEKS;

const makeNewsAgeSelector = includeStale => (newsUpdates, twoWeeksAgo) =>
  newsUpdates.filter(update => {
    const dt = new Date(update.published || update.created).getTime();
    return includeStale ? dt < twoWeeksAgo : dt >= twoWeeksAgo;
  });

const seenSelector = () => (newsUpdates) =>
  newsUpdates.filter(update => {
    const dt = new Date(update.published || update.created).getTime();
    const lastSeen = new Date(cookies.get('updates-last-viewed-date') || 0);
    return dt > lastSeen;
  });

export const freshNewsUpdatesSelector = createSelector(
  newsUpdatesSelector,
  seenSelector,
  twoWeeksAgoSelector,
  makeNewsAgeSelector(false)
);

export const staleNewsUpdatesSelector = createSelector(
  newsUpdatesSelector,
  twoWeeksAgoSelector,
  makeNewsAgeSelector(true)
);

export default newsUpdatesSelector;
