import { createSelector } from "reselect";
import experimentSelector from "./experiment";

export function publishedFilter(update) {
  const hasPublishedField = typeof update.published !== "undefined";
  if (!hasPublishedField) {
    return false;
  }

  const now = Date.now();
  const published = new Date(update.published).getTime();
  return now > published;
}

export function experimentUpdateAvailable(update, availableExperiments) {
  // general updates do not include an experimentSlug so we'll just
  // return early in that case
  const hasExperimentSlug = typeof update.experimentSlug !== "undefined";
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
    return (
      newsUpdates
        // Filter for published updates and updates for available experiments,
        .filter(
          update =>
            publishedFilter(update) &&
            experimentUpdateAvailable(update, availableExperiments)
        )
        // Reverse-chronological sort
        .sort((a, b) => {
          if (b.published < a.published) {
            return -1;
          } else if (b.published > a.published) {
            return 1;
          }
          return 0;
        })
    );
  }
);

const TWO_WEEKS = 2 * 7 * 24 * 60 * 60 * 1000;

const makeNewsAgeSelector = (
  includeStale,
  lastViewedDate,
  now
) => newsUpdates => {
  const twoWeeksAgo = now - TWO_WEEKS;

  // only include updates published within the past 2 weeks, unless
  // includeStale is passed, in which case we will return the whole
  // amount.
  const result = newsUpdates.filter(update => {
    const dt = new Date(update.published || update.created).getTime();
    return includeStale ? dt < twoWeeksAgo : dt >= twoWeeksAgo;
  });

  if (!lastViewedDate) {
    return result;
  }

  // If lastViewedDate is supplied, further filter result by that cut-off date
  return result.filter(update => {
    const dt = new Date(update.published || update.created).getTime();
    const lastSeen = lastViewedDate || 0;
    return dt > lastSeen;
  });
};

export const makeFreshNewsUpdatesSinceLastViewedSelector = (
  lastViewedDate,
  now
) =>
  createSelector(
    newsUpdatesSelector,
    makeNewsAgeSelector(false, lastViewedDate, now)
  );

export const makeNewsUpdatesForDialogSelector = (
  lastViewedDate,
  now
) =>
  createSelector(
    makeFreshNewsUpdatesSinceLastViewedSelector(lastViewedDate, now),
    (newsUpdates) => newsUpdates.filter(update => update.major)
  );

export default newsUpdatesSelector;
