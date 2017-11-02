import { createSelector } from 'reselect';
import moment from 'moment';
import cookies from 'js-cookie';
import experimentSelector from './experiment';

export function publishedFilter(update) {
  const hasPublishedField = (typeof update.published !== 'undefined');
  const isPublished = moment(moment.utc()).isAfter(update.published);

  return (hasPublishedField && isPublished);
}

export function experimentUpdateAvailable(update, availableExperiments) {
  // general updates do not include an experimentSlug so we'll just
  // return early in that case
  const hasExperimentSlug = (typeof update.experimentSlug !== 'undefined');
  if (!hasExperimentSlug) return true;
  return availableExperiments.has(update.experimentSlug);
}

// Gathers up a reverse-chronological list of currently published news updates
// from all available experiments and general Test Pilot updates
const newsUpdatesSelector = createSelector(
  store => store.news.updates,
  experimentSelector,

  (newsUpdates, experiments) => {
    const availableExperiments = new Set(experiments.map(e => e.slug));
    return newsUpdates

      // Filter for published updates and updates for available experiments,
      .filter(update => {
        return (publishedFilter(update) && experimentUpdateAvailable(update, availableExperiments));
      })

      // Reverse-chronological sort
      .sort((a, b) => {
        if (b.published < a.published) {
          return -1;
        } else if (b.published > a.published) {
          return 1;
        }
        return 0;
      });
  }
);


const TWO_WEEKS = 2 * 7 * 24 * 60 * 60 * 1000;
const twoWeeksAgoSelector = () => Date.now() - TWO_WEEKS;

const makeNewsAgeSelector = includeStale => (newsUpdates, twoWeeksAgo) => {
  // only include updates published within the past 2 weeks, unless
  // includeStale is passed, in which case we will return the whole
  // amount.
  const result = newsUpdates.filter(update => {
    const dt = new Date(update.published || update.created).getTime();
    return includeStale ? dt < twoWeeksAgo : dt >= twoWeeksAgo;
  });

  if (includeStale) return result;
  // if includeStale return before filtering out updates which have
  // been seen.
  return result.filter(update => {
    const dt = new Date(update.published || update.created).getTime();
    const lastSeen = new Date(cookies.get('updates-last-viewed-date') || 0);
    return dt > lastSeen;
  });
};

export const freshNewsUpdatesSelector = createSelector(
  newsUpdatesSelector,
  twoWeeksAgoSelector,
  makeNewsAgeSelector(false)
);

export const staleNewsUpdatesSelector = createSelector(
  newsUpdatesSelector,
  twoWeeksAgoSelector,
  makeNewsAgeSelector(true)
);

export default newsUpdatesSelector;
