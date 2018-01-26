import { createSelector } from "reselect";
import moment from "moment";

// Return all experiments from the store, sorted.
export const allExperimentSelector = createSelector(
  store => store.experiments.data,
  experiments => (
    Array.prototype.slice.call(experiments).sort((a, b) => {
      if (a.order > b.order) return 1;
      if (a.order < b.order) return -1;
      return 0;
    })
  )
);


// Return launched experiments from the store, sorted.
export const onlyLaunchedExperimentSelector = createSelector(
  allExperimentSelector,
  experiments => experiments.filter(experiment => (
    (!experiment.dev)
    &&
    (moment(moment.utc()).isAfter(experiment.launch_date) ||
     typeof experiment.launch_date === "undefined")
  ))
);


// If not in a dev environment, filters to only include launched experiments.
export const launchedExperimentSelector = store => (
  store.browser.isDev ? allExperimentSelector(store) :
    onlyLaunchedExperimentSelector(store)
);


// Return the user's primary language subtag.
export const localeSelector = store => store.browser.locale;

// Passed a locale and set of experiments, filters out the experiments that are
// blockedlisted in that locale, or grantlisted and not available in that locale.
export const l10nSelector = (locale, experiments) => experiments.filter(exp => {
  if ("locale_blocklist" in exp) {
    // #2382 Show graduated experiments to every locale.
    if ((new Date(exp.completed)).getTime() < Date.now()) {
      return true;
    }

    return !exp.locale_blocklist.includes(locale);
  }
  if ("locale_grantlist" in exp) {
    return exp.locale_grantlist.includes(locale);
  }
  return true;
});

export const experimentsWithoutFeaturedSelector = createSelector(
  launchedExperimentSelector,
  experiments => experiments.filter((e) => !e.is_featured)
);

export const experimentsWithoutFeaturedSelectorWithL10n = createSelector(
  [localeSelector, experimentsWithoutFeaturedSelector],
  l10nSelector
);

export const featuredExperimentsSelector = createSelector(
  launchedExperimentSelector,
  experiments => experiments.filter((e) => e.is_featured)
    .sort((a, b) => a.order > b.order)
);

export const featuredExperimentsSelectorWithL10n = createSelector(
  [localeSelector, featuredExperimentsSelector],
  l10nSelector
);

export default createSelector(
  [localeSelector, launchedExperimentSelector],
  l10nSelector
);
