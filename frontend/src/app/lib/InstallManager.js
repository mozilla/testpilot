import config from "../config";
import addonActions from "../actions/addon";
import { updateExperiment } from "../actions/experiments";
import InstallHistory from "./install-history";

let installHistory;
let mam = null;
if (typeof navigator !== "undefined") {
  mam = navigator.mozAddonManager;
}

function getAddonId() {
  return {
    "example.com:8000": "@testpilot-addon-local",
    "testpilot.dev.mozaws.net": "@testpilot-addon-dev",
    "testpilot-l10n.dev.mozaws.net": "@testpilot-addon-l10n",
    "testpilot.stage.mozaws.net": "@testpilot-addon-stage",
    "testpilot.firefox.com": "@testpilot-addon"
  }[window.location.host];
}

function mozAddonManagerInstall(url, sendToGA, slug = "test-pilot-addon") {
  const start = url.indexOf("files/") + 6;
  const end = url.indexOf("@");
  const experimentTitle = url.substring(start, end);
  return mam.createInstall({ url }).then(install => {
    return install.install().then(() => {
      sendToGA("event", {
        eventCategory: "ExperimentDetailsPage Interactions",
        eventAction: "Accept From Permission",
        eventLabel: experimentTitle,
        dimension11: slug
      });
    }).catch((err) => {
      sendToGA("event", {
        eventCategory: "ExperimentDetailsPage Interactions",
        eventAction: "Cancel From Permission",
        eventLabel: experimentTitle,
        dimension11: slug
      });
      throw err;
    });
  });
}

export function installAddon(
  sendToGA,
  eventCategory,
  eventLabel,
  slug = null) {
  if (!mam) {
    return Promise.reject();
  }

  return mam.getAddonByID(getAddonId())
    .then(addon => {
      if (addon) {
        if (!addon.isEnabled) {
          return addon.setEnabled(true);
        }
        return Promise.resolve();
      }
      const { protocol, hostname, port } = window.location;
      let downloadUrl;

      if (hostname === "example.com") {
        downloadUrl = `${protocol}//${hostname}:${port}/${config.addonPath}`;
      } else {
        downloadUrl = `https://testpilot.firefox.com/files/${getAddonId()}/latest`;
      }

      const gaEvent = {
        eventCategory: eventCategory,
        eventAction: "install button click",
        eventLabel: eventLabel,
        dimension11: slug
      };

      return mozAddonManagerInstall(downloadUrl, sendToGA).then(() => {
        gaEvent.dimension7 = "no restart";
        sendToGA("event", gaEvent);
      });
    });
}

export function uninstallAddon() {
  if (!mam) {
    return Promise.reject();
  }

  return mam.getAddonByID(getAddonId()).then(addon => {
    if (addon) {
      addon.uninstall();
    }
  });
}

export function setupAddonConnection(store) {
  if (!mam) {
    return;
  }

  function experimentById(id) {
    const { experiments } = store.getState();
    return experiments.data.filter(x => x.addon_id === id)[0];
  }

  mam.addEventListener("onEnabled", addon => {
    if (!addon) { return false; }
    if (addon.id === getAddonId()) {
      return store.dispatch(addonActions.setHasAddon(true));
    }

    const x = experimentById(addon.id);
    if (x) {
      store.dispatch(addonActions.enableExperiment(x));
      store.dispatch(
        updateExperiment(x.addon_id, {
          inProgress: false,
          error: false
        })
      );
    }
    return true;
  });

  mam.addEventListener("onInstalled", addon => {
    if (addon && addon.id === getAddonId()) {
      return store.dispatch(addonActions.txpInstalled());
    }
    installHistory.setActive(addon.id);
    return true;
  });

  function onDisabled(addon) {
    if (!addon) { return false; }
    if (addon.id === getAddonId()) {
      return store.dispatch(addonActions.setHasAddon(false));
    }
    const x = experimentById(addon.id);
    if (x) {
      store.dispatch(addonActions.disableExperiment(x));
      store.dispatch(
        updateExperiment(x.addon_id, {
          inProgress: false,
          error: false
        })
      );

      installHistory.setInactive(addon.id);
    }
    return true;
  }

  mam.addEventListener("onDisabled", onDisabled);
  mam.addEventListener("onUninstalled", onDisabled);
  /*
  mam.addEventListener('onEnabling', (addon, restart) => {
  });
  mam.addEventListener('onDisabling', (addon, restart) => {
  });
  mam.addEventListener('onInstalling', (addon, restart) => {
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
  mam.getAddonByID(getAddonId())
    .then(addon => {
      store.dispatch(addonActions.setHasAddon(!!addon && addon.isEnabled));
    })
    .then(() => getExperimentAddons(store.getState().experiments.data))
    .then(addons => {
      const enabled = addons.filter(a => a && a.isEnabled);
      const installed = {};
      enabled.forEach(a => {
        installed[a.id] = {
          active: true,
          addon_id: a.id
        };
      });
      store.dispatch(addonActions.setInstalled(installed));

      // populate install history for initial load
      if (!installHistory) {
        const installations = Object.assign({}, installed);
        store.getState().experiments.data.forEach(e => {
          if (!installations[e.addon_id]) {
            installations[e.addon_id] = {
              active: false,
              addon_id: e.addon_id
            };
          }
        });
        installHistory = new InstallHistory(installations);
      }
    });
}

export function enableExperiment(dispatch, experiment, sendToGA, eventCategory, eventLabel) {
  if (!mam) {
    return Promise.reject(new Error("no mozAddonManager"));
  }

  dispatch(
    updateExperiment(experiment.addon_id, {
      inProgress: true
    })
  );
  return installAddon(sendToGA, eventCategory, eventLabel, experiment.slug)
    .then(
      () => mam.getAddonByID(experiment.addon_id)
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
            return mozAddonManagerInstall(experiment.xpi_url, sendToGA, experiment.slug)
              .then(() => dispatch(addonActions.experimentInstalled(experiment)));
          }
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
          err => {
            dispatch(addonActions.disableExperiment(experiment));
            dispatch(
              updateExperiment(experiment.addon_id, {
                inProgress: false,
                error: true
              })
            );
            throw err;
          }
        ),
      err => {
        dispatch(
          updateExperiment(experiment.addon_id, {
            inProgress: false
          })
        );
      });
}

export function disableExperiment(dispatch, experiment) {
  if (!mam) {
    return Promise.reject("no mozAddonManager");
  }

  dispatch(
    updateExperiment(experiment.addon_id, {
      inProgress: true
    })
  );

  return mam
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
}

function getExperimentAddons(experiments) {
  return Promise.all(experiments.map(x => mam.getAddonByID(x.addon_id)));
}
