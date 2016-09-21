import { handleActions } from 'redux-actions';

const fetchExperiments = (state, { payload: { lastFetched, experimentsLoaded, experiments } }) =>
  ({ ...state, lastFetched, experimentsLoaded, experiments });

const updateExperiment = (state, { payload: { addonID, data } }) => ({
  ...state,
  experiments: state.experiments.map(experiment =>
    ((experiment.addon_id !== addonID) ?  experiment : { ...experiment, ...data }))
});

export const getExperiments = (state) => state.experiments;

export const getExperimentsLastFetched = (state) => state.lastFetched;

export const getExperimentByID = (state, addonID) =>
  state.experiments.filter(e => e.addon_id === addonID)[0];

export const getExperimentBySlug = (state, filter) =>
  state.experiments.filter(e => e.slug === filter)[0];

export const getExperimentByURL = (state, url) =>
  state.experiments.filter(e => e.xpi_url === url)[0];

export const getExperimentInProgress = (state) =>
  state.experiments.filter(e => e.inProgress)[0];

export const isExperimentsLoaded = (state) => state.experimentsLoaded;

export default handleActions({
  fetchExperiments,
  updateExperiment
}, {
  experiments: [],
  experimentsLoaded: false,
  lastFetched: null
});
