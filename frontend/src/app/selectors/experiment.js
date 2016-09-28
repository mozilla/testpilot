import { createSelector } from 'reselect';
import moment from 'moment';


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
export const launchedExperimentSelector = createSelector(
  allExperimentSelector,
  experiments => experiments.filter(experiment => (
    moment(moment.utc()).isAfter(experiment.launch_date) ||
    typeof experiment.launch_date === 'undefined'
  ))
);


export default store => (
  store.browser.isDev ? allExperimentSelector(store) : launchedExperimentSelector(store)
);
