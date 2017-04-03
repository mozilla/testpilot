/* global CustomEvent */
import cookies from 'js-cookie';

import addonActions from '../actions/addon';
import experimentActions from '../actions/experiments';
import { getExperimentByID, getExperimentByURL, getExperimentInProgress } from '../reducers/experiments';

const INSTALL_STATE_WATCH_PERIOD = 2000;
const DISCONNECT_TIMEOUT = 3333;

function listenForAddonMessages(store, handler) {
  window.addEventListener('from-addon-to-web', handler);
  pollAddon();
}

export function installAddon(requireRestart, sendToGA, eventCategory, eventLabel) {
  const { protocol, hostname, port } = window.location;
  const path = '/static/addon/latest';
  const downloadUrl = `${protocol}//${hostname}${port ? ':' + port : ''}${path}`;

  const gaEvent = {
    eventCategory: eventCategory,
    eventAction: 'install button click',
    eventLabel: eventLabel
  };

  cookies.set('first-run', 'true');

  gaEvent.outboundURL = downloadUrl;
  sendToGA('event', gaEvent);
  return Promise.resolve();
}

export function uninstallAddon() {
  sendMessage('uninstall-self');
}

export function setupAddonConnection(store) {
  listenForAddonMessages(store, evt => {
    messageReceived(store);
    handleMessage(store, evt);
  });
}

let disconnectTimer = 0;
function addonDisconnected() {
  window.location.reload();
}

let pollTimer = 0;
export function pollAddon() {
  sendMessage('sync-installed');
  pollTimer = setTimeout(pollAddon, INSTALL_STATE_WATCH_PERIOD);
}

export function listen(store) {
  listenForAddonMessages(store, evt => {
    messageReceived(store);

    // HACK for setting installedAddons
    const { type, data } = evt.detail;
    if (type === 'sync-installed-result') {
      store.dispatch(addonActions.setInstalledAddons(data.active));
    }
  });
  store.dispatch(addonActions.setClientUuid(window.navigator.testpilotClientUUID));
}

export function enableExperiment(dispatch, experiment) {
  dispatch(experimentActions.updateExperiment(experiment.addon_id, { inProgress: true }));
  sendMessage('install-experiment', experiment);
}

export function disableExperiment(dispatch, experiment) {
  dispatch(experimentActions.updateExperiment(experiment.addon_id, { inProgress: true }));
  sendMessage('uninstall-experiment', experiment);
}

function sendMessage(type, data) {
  document.documentElement.dispatchEvent(new CustomEvent('from-web-to-addon', {
    bubbles: true,
    detail: { type, data }
  }));
}

function messageReceived(store) {
  if (pollTimer) {
    clearTimeout(pollTimer);
    pollTimer = 0;
  }
  clearTimeout(disconnectTimer);
  disconnectTimer = setTimeout(addonDisconnected.bind(null, store), DISCONNECT_TIMEOUT);
  const { addon } = store.getState();
  if (!addon.hasAddon) {
    store.dispatch(addonActions.setHasAddon(true));
  }
}

function handleMessage(store, evt) {
  const { type, data } = evt.detail;
  const { experiments } = store.getState();

  let experiment;
  if (data && 'id' in data) {
    experiment = getExperimentByID(experiments, data.id);
  } else if (data && 'sourceURI' in data) {
    experiment = getExperimentByURL(experiments, data.sourceURI);
  } else {
    // Last ditch effort to find experiment in progress if data is missing addon ID
    experiment = getExperimentInProgress(experiments);
  }

  switch (type) {
    case 'sync-installed-result':
      store.dispatch(addonActions.setClientUuid(data.clientUUID));
      store.dispatch(addonActions.setInstalled(data.installed));
      store.dispatch(addonActions.setInstalledAddons(data.active));
      break;
    case 'addon-self:uninstalled':
      store.dispatch(addonActions.setHasAddon(false));
      pollAddon();
      break;
    case 'addon-install:download-failed':
      store.dispatch(addonActions.disableExperiment(experiment));
      store.dispatch(experimentActions.updateExperiment(
        experiment.addon_id, { inProgress: false, error: true }
      ));
      break;
    case 'addon-install:install-failed':
      store.dispatch(addonActions.disableExperiment(experiment));
      store.dispatch(experimentActions.updateExperiment(
        experiment.addon_id, { inProgress: false, error: true }
      ));
      break;
    case 'addon-install:install-ended':
      store.dispatch(addonActions.enableExperiment(experiment));
      store.dispatch(experimentActions.updateExperiment(
        experiment.addon_id, { inProgress: false, error: false }
      ));
      break;
    case 'addon-uninstall:uninstall-ended':
      store.dispatch(addonActions.disableExperiment(experiment));
      store.dispatch(experimentActions.updateExperiment(
        experiment.addon_id, { inProgress: false, error: false }
      ));
      break;
    case 'addon-manage:enabled':
      store.dispatch(addonActions.manuallyEnableExperiment(experiment));
      break;
    case 'addon-manage:disabled':
      store.dispatch(addonActions.manuallyDisableExperiment(experiment));
      break;
    default:
      break;
  }
}
