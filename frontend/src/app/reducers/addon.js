import { handleActions } from 'redux-actions';

const setHasAddon = (state, { payload: hasAddon }) => ({ ...state, hasAddon });

const setInstalled = (state, { payload: installed }) =>
  ({ ...state, installed: (installed || {}) });

const setClientUuid = (state, { payload: clientUUID }) => ({ ...state, clientUUID });

const enableExperiment = (state, { payload: experiment }) => {
  const newInstalled = { ...state.installed };
  newInstalled[experiment.addon_id] = experiment;
  return { ...state, installed: newInstalled };
};

const disableExperiment = (state, { payload: experiment }) => {
  const newInstalled = { ...state.installed };
  delete newInstalled[experiment.addon_id];
  return { ...state, installed: newInstalled };
};

export const getInstalled = (state) => state.installed;

export const isExperimentEnabled = (state, experiment) =>
  (experiment && experiment.addon_id in state.installed);

export default handleActions({
  setHasAddon,
  setInstalled,
  setClientUuid,
  enableExperiment,
  disableExperiment
}, {
  hasAddon: false,
  installed: {},
  clientUUID: ''
});
