import { handleActions } from 'redux-actions';

const setHasAddon = (state, { payload: hasAddon }) => ({
  ...state,
  hasAddon,
  installed: hasAddon ? state.installed : {}
});

const setInstalled = (state, { payload: { installed, installedLoaded } }) =>
  ({ ...state, installed, installedLoaded });

function setInstalledAddons(state, { payload: installedAddons }) {
  const newInstalled = {};
  const actuallyInstalledAddons = (installedAddons || []);
  for (const addonId of Object.keys(state.installed)) {
    const experiment = state.installed[addonId];
    if (actuallyInstalledAddons.indexOf(addonId) === -1) {
      newInstalled[addonId] = { manuallyDisabled: true, ...experiment };
    } else {
      newInstalled[addonId] = experiment;
    }
  }
  return { ...state, installed: newInstalled, installedAddons: actuallyInstalledAddons };
}

const setClientUuid = (state, { payload: clientUUID }) => ({ ...state, clientUUID });

const manuallyEnableExperiment = (state, { payload: experiment }) => {
  const newInstalled = { ...state.installed };
  newInstalled[experiment.addon_id] = { manuallyDisabled: false, ...experiment };
  return { ...state, installed: newInstalled };
};

const manuallyDisableExperiment = (state, { payload: experiment }) => {
  const newInstalled = { ...state.installed };
  newInstalled[experiment.addon_id] = { manuallyDisabled: true, ...experiment };
  return { ...state, installed: newInstalled };
};

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

export function isExperimentEnabled(state, experiment) {
  return !!(
    experiment &&
    experiment.addon_id in state.installed &&
    !state.installed[experiment.addon_id].manuallyDisabled);
}

export const isAfterCompletedDate = (experiment) =>
  ((new Date(experiment.completed)).getTime() < Date.now());

export const isInstalledLoaded = (state) => state.installedLoaded;

export default handleActions({
  setHasAddon,
  setInstalled,
  setInstalledAddons,
  setClientUuid,
  enableExperiment,
  disableExperiment,
  manuallyEnableExperiment,
  manuallyDisableExperiment,
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
