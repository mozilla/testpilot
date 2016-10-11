import { handleActions } from 'redux-actions';

const setHasAddon = (state, { payload: hasAddon }) => ({ ...state, hasAddon });

const setInstalled = (state, { payload: { installed, installedLoaded } }) =>
  ({ ...state, installed, installedLoaded });

const setInstalledAddons = (state, { payload: installedAddons }) =>
  ({ ...state, installedAddons: (installedAddons || []) });

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

const requireRestart = state => {
  return {
    ...state,
    restart: {
      isRequired: true
    }
  };
};

export const getInstalled = (state) => state.installed;

export const isExperimentEnabled = (state, experiment) =>
  !!(experiment && experiment.addon_id in state.installed);

export const isExperimentCompleted = (experiment) =>
  ((new Date(experiment.completed)).getTime() < Date.now());

export const isInstalledLoaded = (state) => state.installedLoaded;

export default handleActions({
  setHasAddon,
  setInstalled,
  setInstalledAddons,
  setClientUuid,
  enableExperiment,
  disableExperiment,
  requireRestart
}, {
  hasAddon: false,
  installed: {},
  installedLoaded: false,
  installedAddons: [],
  clientUUID: '',
  restart: {
    isRequired: false,
    forExperiment: null
  }
});
