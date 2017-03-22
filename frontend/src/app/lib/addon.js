/* global CustomEvent */
import cookies from 'js-cookie';

import addonActions from '../actions/addon';
import experimentActions from '../actions/experiments';
import { getExperimentByID, getExperimentByURL, getExperimentInProgress } from '../reducers/experiments';

const INSTALL_STATE_WATCH_PERIOD = 2000;
const DISCONNECT_TIMEOUT = 3333;
const MOZADDONMANAGER_ALLOWED_HOSTNAMES = [
  'testpilot.firefox.com',
  'testpilot.stage.mozaws.net',
  'testpilot.dev.mozaws.net',
  'example.com'
];

let RESTART_NEEDED;

function mozAddonManagerInstall(url) {
  return navigator.mozAddonManager.createInstall({ url }).then(install => {
    navigator.mozAddonManager.addEventListener('onInstalling', data => {
      RESTART_NEEDED = data.needsRestart;
    });
    return new Promise((resolve, reject) => {
      install.addEventListener('onInstallEnded', () => resolve());
      install.addEventListener('onInstallFailed', () => reject());
      install.install();
    });
  });
}

export function installAddon(requireRestart, sendToGA, eventCategory, eventLabel) {
  const { protocol, hostname, port } = window.location;
  const path = '/static/addon/latest';
  const downloadUrl = `${protocol}//${hostname}${port ? ':' + port : ''}${path}`;
  const useMozAddonManager = (
    navigator.mozAddonManager &&
    protocol === 'https:' &&
    MOZADDONMANAGER_ALLOWED_HOSTNAMES.includes(hostname)
  );

  const gaEvent = {
    eventCategory: eventCategory,
    eventAction: 'install button click',
    eventLabel: eventLabel
  };

  cookies.set('first-run', 'true');

  let result;
  if (useMozAddonManager) {
    result = mozAddonManagerInstall(downloadUrl).then(() => {
      gaEvent.dimension7 = RESTART_NEEDED ? 'restart required' : 'no restart';
      sendToGA('event', gaEvent);
      if (RESTART_NEEDED) {
        requireRestart();
      }
    });
  } else {
    gaEvent.outboundURL = downloadUrl;
    sendToGA('event', gaEvent);
    result = Promise.resolve();
  }
  return result;
}

export function uninstallAddon() {
  sendMessage('uninstall-self');
}

export function setupAddonConnection(store) {
  window.addEventListener(
    'from-addon-to-web',
    evt => messageReceived(store, evt)
  );

  pollAddon();
}

let disconnectTimer = 0;
function addonDisconnected(store) {
  if (parseFloat(window.navigator.testpilotAddonVersion) > 0.8) {
    store.dispatch(addonActions.setHasAddon(false));
    pollAddon();
  }
}

let pollTimer = 0;
export function pollAddon() {
  sendMessage('sync-installed');
  pollTimer = setTimeout(pollAddon, INSTALL_STATE_WATCH_PERIOD);
}

export function sendMessage(type, data) {
  document.documentElement.dispatchEvent(new CustomEvent('from-web-to-addon', {
    bubbles: true,
    detail: { type, data }
  }));
}

export function enableExperiment(dispatch, experiment) {
  dispatch(experimentActions.updateExperiment(experiment.addon_id, { inProgress: true }));
  sendMessage('install-experiment', experiment);
}

export function disableExperiment(dispatch, experiment) {
  dispatch(experimentActions.updateExperiment(experiment.addon_id, { inProgress: true }));
  sendMessage('uninstall-experiment', experiment);
}

function messageReceived(store, evt) {
  if (pollTimer) {
    clearTimeout(pollTimer);
    pollTimer = 0;
  }
  clearTimeout(disconnectTimer);
  disconnectTimer = setTimeout(addonDisconnected.bind(null, store), DISCONNECT_TIMEOUT);

  const { type, data } = evt.detail;
  const { experiments, addon } = store.getState();

  if (!addon.hasAddon) {
    store.dispatch(addonActions.setHasAddon(true));
  }

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
