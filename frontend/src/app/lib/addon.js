/* global CustomEvent */
import cookies from 'js-cookie';

import { sendToGA } from './utils';
import addonActions from '../actions/addon';
import experimentActions from '../actions/experiments';
import { getExperimentByID, getExperimentByURL, getExperimentInProgress } from '../reducers/experiments';

const INSTALL_STATE_WATCH_PERIOD = 2000;

export function installAddon(eventCategory) {
  const downloadUrl = '/static/addon/addon.xpi';
  sendToGA('event', {
    eventCategory,
    eventAction: 'button click',
    eventLabel: 'Install the Add-on',
    outboundURL: downloadUrl
  });
  cookies.set('first-run', 'true');
}

export function setupAddonConnection(store) {
  store.dispatch(addonActions.setInstalled());
  watchForAddonInstallStateChange(store);
  window.addEventListener('from-addon-to-web',
                          evt => messageReceived(store, evt));
  sendMessage('sync-installed');
}

// Periodically check window.navigator.testpilotAddon and keep store in sync
let installStateWatcherTimer = null;
function watchForAddonInstallStateChange(store) {
  store.dispatch(addonActions.setHasAddon(window.navigator.testpilotAddon));

  if (installStateWatcherTimer) {
    clearInterval(installStateWatcherTimer);
  }

  installStateWatcherTimer = setInterval(() => {
    const previousState = store.getState().addon.hasAddon;
    const currentState = !!window.navigator.testpilotAddon;
    if (previousState !== currentState) {
      store.dispatch(addonActions.setHasAddon(currentState));
      sendMessage('sync-installed');
    }
  }, INSTALL_STATE_WATCH_PERIOD);
}

export function sendMessage(type, data) {
  console.log('TO ADDON', type, data);
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
  const { type, data } = evt.detail;

  console.log('FROM ADDON', type, data);

  const experimentsState = store.getState().experiments;

  let experiment;
  if (data && 'id' in data) {
    experiment = getExperimentByID(experimentsState, data.id);
  } else if (data && 'sourceURI' in data) {
    experiment = getExperimentByURL(experimentsState, data.sourceURI);
  } else {
    // Last ditch effort to find experiment in progress if data is missing addon ID
    experiment = getExperimentInProgress(experimentsState);
  }

  switch (type) {
    case 'sync-installed-result':
      store.dispatch(addonActions.setClientUuid(data.clientUUID));
      store.dispatch(addonActions.setInstalled(data.installed));
      break;
    case 'addon-self:uninstalled':
      store.dispatch(addonActions.setHasAddon(false));
      // HACK: The add-on should do this, but early versions do not.
      window.navigator.testpilotAddon = null;
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
        experiment.addon_id, { inProgress: false, error: true
      }));
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
    /**
     * TODO: See also issue #1300. These events work, but the corresponding
     * behavior of the "Enable" UI button doesn't account for
     * installed-but-disabled experiments
    case 'addon-manage:enabled':
      store.dispatch(addonActions.enableExperiment(experiment));
      break;
    case 'addon-manage:disabled':
      store.dispatch(addonActions.disableExperiment(experiment));
      break;
    */
    default:
      break;
  }
}
