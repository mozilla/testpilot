import cookies from 'js-cookie';

import addonActions from '../actions/addon';
import { updateExperiment } from '../actions/experiments';


const RESTART_NEEDED = false; // TODO

let mam;
if (typeof navigator !== 'undefined') {
  mam = navigator.mozAddonManager;
}

function mozAddonManagerInstall(url) {
  return mam.createInstall({ url }).then(install => {
    return new Promise((resolve, reject) => {
      install.addEventListener('onInstallEnded', () => resolve());
      install.addEventListener('onDownloadFailed', () => reject());
      install.addEventListener('onInstallFailed', () => reject());
      install.install();
    });
  });
}

export function installAddon(
  requireRestart,
  sendToGA,
  eventCategory,
  eventLabel
) {
  const { protocol, hostname, port } = window.location;
  const path = '/static/addon/addon.xpi';
  const downloadUrl = `${protocol}//${hostname}${port ? ':' + port : ''}${path}`;

  const gaEvent = {
    eventCategory: eventCategory,
    eventAction: 'install button click',
    eventLabel: eventLabel
  };

  cookies.set('first-run', 'true');

  return mozAddonManagerInstall(downloadUrl).then(() => {
    gaEvent.dimension7 = RESTART_NEEDED ? 'restart required' : 'no restart';
    sendToGA('event', gaEvent);
    if (RESTART_NEEDED) {
      requireRestart();
    }
  });
}

export function uninstallAddon() {
  mam.getAddonByID('@testpilot-addon').then(addon => {
    if (addon) {
      addon.uninstall();
    }
  });
}

export function setupAddonConnection(store) {
  mam.addEventListener('onEnabled', addon => {
    if (addon) {
      const { experiments } = store.getState();
      const i = experiments.data.map(x => x.addon_id).indexOf(addon.id);
      if (i > -1) {
        const x = experiments.data[i];
        store.dispatch(addonActions.enableExperiment(x));
        store.dispatch(
          updateExperiment(x.addon_id, {
            inProgress: false,
            error: false
          })
        );
      }
    }
  });
  function onDisabled(addon) {
    if (addon) {
      const { experiments } = store.getState();
      const i = experiments.data.map(x => x.addon_id).indexOf(addon.id);
      if (i > -1) {
        const x = experiments.data[i];
        store.dispatch(addonActions.disableExperiment(x));
        store.dispatch(
          updateExperiment(x.addon_id, {
            inProgress: false,
            error: false
          })
        );
      }
    }
  }
  mam.addEventListener('onDisabled', onDisabled);
  mam.addEventListener('onUninstalled', onDisabled);
/*
  mam.addEventListener('onEnabling', (addon, restart) => {
  });
  mam.addEventListener('onDisabling', (addon, restart) => {
  });
  mam.addEventListener('onInstalling', (addon, restart) => {
  });
  mam.addEventListener('onInstalled', addon => {
  });
  mam.addEventListener('onUninstalling', (addon, restart) => {
    // TODO similar logic to txp addon AddonListener.js
  });
  mam.addEventListener('onOperationCancelled', addon => {
    // TODO similar logic to txp addon AddonListener.js
  });
  mam.addEventListener('onPropertyChanged', (addon, p) => {
  });
*/
  getExperimentAddons(store.getState().experiments.data)
    .then(addons => {
      const enabled = addons.filter(a => a && a.isEnabled);
      const installed = {};
      enabled.forEach(a => {
        installed[a.id] = {
          // TODO see which of these are required
          active: true,
          addon_id: a.id
          // created:
          // html_url:
          // installDate:
          // thumbnail:
          // title:
        };
      });
      store.dispatch(addonActions.setInstalled(installed));
    });
}

export function enableExperiment(dispatch, experiment) {
  mam
    .getAddonByID(experiment.addon_id)
    .then(
      addon => {
        if (addon) {
          // already installed
          if (!addon.isEnabled) {
            return addon.setEnabled(true);
          }
          // already enabled
          return Promise.resolve();
        }
        return mozAddonManagerInstall(experiment.xpi_url);
      } // TODO error case
    )
    .then(
      () => {
        dispatch(addonActions.enableExperiment(experiment));
        dispatch(
          updateExperiment(experiment.addon_id, {
            inProgress: false,
            error: false
          })
        );
      },
      () => {
        dispatch(addonActions.disableExperiment(experiment));
        dispatch(
          updateExperiment(experiment.addon_id, {
            inProgress: false,
            error: true
          })
        );
      }
    );
  dispatch(
    updateExperiment(experiment.addon_id, {
      inProgress: true
    })
  );
}

export function disableExperiment(dispatch, experiment) {
  mam
    .getAddonByID(experiment.addon_id)
    .then(
      addon => {
        if (addon) {
          return addon.uninstall();
        }
        return Promise.resolve();
      } // TODO error case
    )
    .then(() => {
      dispatch(addonActions.disableExperiment(experiment));
      dispatch(
        updateExperiment(experiment.addon_id, {
          inProgress: false,
          error: false
        })
      );
    });
  dispatch(
    updateExperiment(experiment.addon_id, {
      inProgress: true
    })
  );
}

function getExperimentAddons(experiments) {
  return Promise.all(
    experiments.map(x => mam.getAddonByID(x.addon_id))
  );
}
