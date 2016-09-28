import { handleActions } from 'redux-actions';

const fetchExperiments = (state, { payload: { lastFetched, experimentsLoaded, data } }) =>
  ({ ...state, lastFetched, experimentsLoaded, data });

const updateExperiment = (state, { payload: { addonID, data } }) => ({
  ...state,
  data: state.data.map(experiment =>
    ((experiment.addon_id !== addonID) ?  experiment : { ...experiment, ...data }))
});

export const getExperiments = (state) => state.data;

export const getExperimentsLastFetched = (state) => state.lastFetched;

export const getExperimentByID = (state, addonID) =>
  state.data.filter(e => e.addon_id === addonID)[0];

export const getExperimentBySlug = (state, filter) =>
  state.data.filter(e => e.slug === filter)[0];

export const getExperimentByURL = (state, url) =>
  state.data.filter(e => e.xpi_url === url)[0];

export const getExperimentInProgress = (state) =>
  state.data.filter(e => e.inProgress)[0];

export const isExperimentsLoaded = (state) => state.experimentsLoaded;

export default handleActions({
  fetchExperiments,
  updateExperiment
}, {
  data: [],
  experimentsLoaded: false,
  lastFetched: null
});
