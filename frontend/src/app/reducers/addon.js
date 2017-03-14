

function setHasAddon(state, { payload: hasAddon }) {
  return {
    ...state,
    hasAddon,
    installed: hasAddon ? state.installed : {}
  };
}

function setInstalled(state, { payload: { installed, installedLoaded } }) {
  return {
    ...state,
    installed,
    installedLoaded
  };
}

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

function setClientUuid(state, { payload: clientUUID }) {
  return { ...state, clientUUID };
}

function manuallyEnableExperiment(state, { payload: experiment }) {
  const newInstalled = { ...state.installed };
  newInstalled[experiment.addon_id] = { manuallyDisabled: false, ...experiment };
  return { ...state, installed: newInstalled };
}

function manuallyDisableExperiment(state, { payload: experiment }) {
  const newInstalled = { ...state.installed };
  newInstalled[experiment.addon_id] = { manuallyDisabled: true, ...experiment };
  return { ...state, installed: newInstalled };
}

function enableExperiment(state, { payload: experiment }) {
  const newInstalled = { ...state.installed };
  newInstalled[experiment.addon_id] = experiment;
  return { ...state, installed: newInstalled };
}

function disableExperiment(state, { payload: experiment }) {
  const newInstalled = { ...state.installed };
  delete newInstalled[experiment.addon_id];
  return { ...state, installed: newInstalled };
}

function requireRestart(state) {
  return {
    ...state,
    restart: {
      isRequired: true
    }
  };
}

export function getInstalled(state) {
  return state.installed;
}

export function isExperimentEnabled(state, experiment) {
  return !!(
    experiment &&
    experiment.addon_id in state.installed &&
    !state.installed[experiment.addon_id].manuallyDisabled);
}

export function isAfterCompletedDate(experiment) {
  return ((new Date(experiment.completed)).getTime() < Date.now());
}

export function isInstalledLoaded(state) {
  return state.installedLoaded;
}

export default function addonReducer(state, action) {
  if (state === undefined) {
    return {
      hasAddon: false,
      installed: {},
      installedLoaded: false,
      installedAddons: [],
      clientUUID: '',
      restart: {
        isRequired: false,
        forExperiment: null
      }
    };
  }

  switch (action.type) {
    case 'SET_HAS_ADDON':
      return setHasAddon(state, action);
    case 'SET_INSTALLED':
      return setInstalled(state, action);
    case 'SET_INSTALLED_ADDONS':
      return setInstalledAddons(state, action);
    case 'SET_CLIENT_UUID':
      return setClientUuid(state, action);
    case 'ENABLE_EXPERIMENT':
      return enableExperiment(state, action);
    case 'DISABLE_EXPERIMENT':
      return disableExperiment(state, action);
    case 'MANUALLY_ENABLE_EXPERIMENT':
      return manuallyEnableExperiment(state, action);
    case 'MANUALLY_DISABLE_EXPERIMENT':
      return manuallyDisableExperiment(state, action);
    case 'REQUIRE_RESTART':
      return requireRestart(state, action);
    default:
      return state;
  }
}
