import { handleActions } from 'redux-actions';

const fetchUserCounts = (state, { payload: { data } }) => ({
  ...state,
  data: state.data.map(experiment =>
    ((data[experiment.addon_id]) ? { ...experiment, installation_count: data[experiment.addon_id] } : experiment))
});


const updateExperiment = (state, { payload: { addonID, data } }) => ({
  ...state,
  data: state.data.map(experiment =>
    ((experiment.addon_id !== addonID) ?  experiment : { ...experiment, ...data }))
});

export const getExperiments = (state) => state.data;

export const getExperimentByID = (state, addonID) =>
  state.data.filter(e => e.addon_id === addonID)[0];

export const getExperimentBySlug = (state, filter) =>
  state.data.filter(e => e.slug === filter)[0];

export const getExperimentByURL = (state, url) =>
  state.data.filter(e => e.xpi_url === url)[0];

export const getExperimentInProgress = (state) =>
  state.data.filter(e => e.inProgress)[0];

export default handleActions({
  fetchUserCounts,
  updateExperiment
}, {
  data: []
});
