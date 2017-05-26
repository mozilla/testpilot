import { createSelector } from 'reselect';
import moment from 'moment';
import experimentSelector from './experiment';

// Gathers up a reverse-chronological list of currently published news updates
// from all available experiments and Test Pilot in general
const newsUpdatesSelector = createSelector(
  store => store.news.updates,
  store => store.browser.isDev,
  experimentSelector,

  (newsUpdates, isDev, experiments) => {
    const availableExperiments = new Set(experiments.map(e => e.slug));
    return newsUpdates

      // Filter for published updates and updates for available experiments,
      // but allow all updates if we're in dev.
      .filter(update => isDev || (
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

export default newsUpdatesSelector;
