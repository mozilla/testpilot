/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

const EXPERIMENT_UPDATE_INTERVAL = 12 * 60 * 60 * 1000; // 12 hours

const { AddonManager } = require('resource://gre/modules/AddonManager.jsm');
const aboutConfig = require('sdk/preferences/service');
const self = require('sdk/self');
const store = require('sdk/simple-storage').storage;
const tabs = require('sdk/tabs');
const { PrefsTarget } = require('sdk/preferences/event-target');
const URL = require('sdk/url').URL;

const { App } = require('./lib/app');
const ExperimentHacks = require('./lib/experiment-hacks');
const ExperimentNotifications = require('./lib/experiment-notifications');
const Metrics = require('./lib/metrics');
const SharePrompt = require('./lib/share-prompt');
const survey = require('./lib/survey');
const ToolbarButton = require('./lib/toolbar-button');
const WebExtensionChannels = require('./lib/webextension-channels');

const settings = {};
let prefs;
let app;
// Canned selectable server environment configs
const SERVER_ENVIRONMENTS = {
  local: {
    BASE_URL: 'http://testpilot.dev:8000',
    TESTPILOT_PREFIX: 'testpilot.addon.LOCAL.',
    WHITELIST_URLS: 'https://www.mozilla.org/*,about:home',
    BADGE_COLOR: '#AA00AA'
  },
  example: {
    BASE_URL: 'https://example.com:8000',
    TESTPILOT_PREFIX: 'testpilot.addon.LOCAL.',
    WHITELIST_URLS: 'https://www.mozilla.org/*,about:home',
    BADGE_COLOR: '#AA00AA'
  },
  dev: {
    BASE_URL: 'https://testpilot.dev.mozaws.net',
    TESTPILOT_PREFIX: 'testpilot.addon.DEV.',
    WHITELIST_URLS: 'https://www.mozilla.org/*,about:home',
    BADGE_COLOR: '#AAAA00'
  },
  stage: {
    BASE_URL: 'https://testpilot.stage.mozaws.net',
    TESTPILOT_PREFIX: 'testpilot.addon.STAGE.',
    WHITELIST_URLS: 'https://www.mozilla.org/*,about:home',
    BADGE_COLOR: '#A0AAA0'
  },
  production: {
    BASE_URL: 'https://testpilot.firefox.com',
    TESTPILOT_PREFIX: 'testpilot.addon.MAIN.',
    WHITELIST_URLS: 'https://www.mozilla.org/*,about:home',
    BADGE_COLOR: '#00AAAA'
  }
};

function loadEnvironment() {
  const env = aboutConfig.get('testpilot.env', 'production');
  if (!aboutConfig.has('testpilot.env')) {
    aboutConfig.set('testpilot.env', env);
  }
  prefs = PrefsTarget(); // eslint-disable-line new-cap
  prefs.on('testpilot.env', () => {
    const newEnv = prefs.prefs['testpilot.env'];
    aboutConfig.set('extensions.webapi.testing', newEnv !== 'production');
    updatePrefs(newEnv);
  });
  updatePrefs(env);
}

function changeApp(env) {
  if (app) {
    app.destroy();
  }

  app = new App({
    baseUrl: env.BASE_URL,
    badgeColor: env.BADGE_COLOR,
    whitelist: env.WHITELIST_URLS,
    addonVersion: self.version,
    reloadInterval: EXPERIMENT_UPDATE_INTERVAL
  });
  app.on('loaded', experimentsLoaded)
    .on('uninstall-self', uninstallSelf)
    .on('install-experiment', installExperiment)
    .on('uninstall-experiment', uninstallExperiment)
    .on('sync-installed', syncInstalled);
}

function updatePrefs(environment) {
  // Select the environment, with production as a default.
  const env = (environment in SERVER_ENVIRONMENTS) ?
    SERVER_ENVIRONMENTS[environment] : SERVER_ENVIRONMENTS.production;

  // Update the settings from selected environment
  Object.assign(settings, {
    BASE_URL: env.BASE_URL,
    ALLOWED_ORIGINS: env.BASE_URL + '/*',
    ALLOWED_ORIGINS_VIEWINSTALLEDFLAG: env.BASE_URL + '/*,' + env.WHITELIST_URLS,
    HOSTNAME: URL(env.BASE_URL).hostname, // eslint-disable-line new-cap
    TESTPILOT_PREFIX: env.TESTPILOT_PREFIX
  });

  // kickoff our random experiment surveys
  survey.init();

  changeApp(env);

  if (self.loadReason === 'install') {
    app.send('addon-self:installed');
  } else if (self.loadReason === 'enable') {
    app.send('addon-self:enabled');
  } else if (self.loadReason === 'upgrade') {
    app.send('addon-self:upgraded');
  }
}

function openOnboardingTab() {
  tabs.open({
    url: settings.BASE_URL + '/onboarding',
    inBackground: true
  });
}

function experimentsLoaded(experiments) {
  store.availableExperiments = experiments;
  ExperimentNotifications.maybeSendNotifications();
  ToolbarButton.updateButtonBadge();
  AddonManager.getAllAddons(addons => {
    // Filter addons by known experiments, index by ID
    store.installedAddons = {};
    addons.filter(addon => isTestpilotAddonID(addon.id))
          .forEach(setAddonActiveState);
  });
}

function setAddonActiveState(addon) {
  const xp = store.availableExperiments[addon.id];
  if (xp) { delete xp.active; }
  if (addon.isActive) {
    ExperimentHacks.enabled(addon.id);
  } else {
    ExperimentHacks.disabled(addon.id);
  }
  store.installedAddons[addon.id] = Object.assign({
    active: addon.isActive,
    installDate: addon.installDate
  }, store.availableExperiments[addon.id]);
}

function uninstallExperiment(experiment) {
  if (isTestpilotAddonID(experiment.addon_id)) {
    AddonManager.getAddonByID(experiment.addon_id, a => {
      if (a) { a.uninstall(); }
    });
  }
}

function installExperiment(experiment) {
  if (isTestpilotAddonID(experiment.addon_id)) {
    AddonManager.getInstallForURL(experiment.xpi_url, install => {
      install.install();
    }, 'application/x-xpinstall');
  }
}

function uninstallSelf() {
  AddonManager.getAddonByID(self.id, a => a.uninstall());
}

function formatInstallData(install, addon) {
  const formatted = {
    'name': install.name || '',
    'error': install.error,
    'state': install.state,
    'version': install.version || '',
    'progress': install.progress,
    'maxProgress': install.maxProgress
  };

  if ('sourceURI' in install) {
    formatted.sourceURI = install.sourceURI.prePath + install.sourceURI.path;
  }

  if (addon) {
    Object.assign(formatted, {
      'id': addon.id,
      'description': addon.description,
      'homepageURL': addon.homepageURL,
      'iconURL': addon.iconURL,
      'size': addon.size,
      'signedState': addon.signedState,
      'permissions': addon.permissions
    });
  }

  return formatted;
}

function isTestpilotAddonID(id) {
  return app.hasAddonID(id);
}

function syncInstalled() {
  AddonManager.getAllAddons(addons => {
    const activeAddonIds = addons
      .filter(a => (a.isActive && !a.appDisabled && !a.userDisabled))
      .map(a => a.id);

    app.send(
      'sync-installed-result',
      {
        clientUUID: store.clientUUID,
        installed: store.installedAddons,
        active: activeAddonIds
      }
    );
  });
}

const addonListener = {
  onEnabled: function(addon) {
    syncInstalled();
    if (isTestpilotAddonID(addon.id)) {
      setAddonActiveState(addon);
      app.send('addon-manage:enabled', {
        id: addon.id,
        name: addon.name,
        version: addon.version
      });
      Metrics.experimentEnabled(addon.id);
      WebExtensionChannels.updateExperimentChannels();
    }
  },
  onDisabled: function(addon) {
    syncInstalled();
    if (isTestpilotAddonID(addon.id)) {
      setAddonActiveState(addon);
      app.send('addon-manage:disabled', {
        id: addon.id,
        name: addon.name,
        version: addon.version
      });
      Metrics.experimentDisabled(addon.id);
      WebExtensionChannels.updateExperimentChannels();
    }
  },
  onUninstalling: function(addon) {
    syncInstalled();
    if (isTestpilotAddonID(addon.id)) {
      app.send('addon-uninstall:uninstall-started', {
        id: addon.id,
        name: addon.name,
        version: addon.version
      });
      ExperimentHacks.uninstalling(addon.id);
    }
  },
  onUninstalled: function(addon) {
    if (isTestpilotAddonID(addon.id)) {
      app.send('addon-uninstall:uninstall-ended', {
        id: addon.id,
        name: addon.name,
        version: addon.version
      }, addon);

      setAddonActiveState(addon);
      delete store.installedAddons[addon.id];

      Metrics.experimentDisabled(addon.id);
      WebExtensionChannels.updateExperimentChannels();
    }
  },
  onInstalled: syncInstalled,
  onOperationCancelled: syncInstalled
};
AddonManager.addAddonListener(addonListener);

const installListener = {
  onInstallEnded: function(install, addon) {
    if (!isTestpilotAddonID(addon.id)) { return; }
    setAddonActiveState(addon);
    app.send('addon-install:install-ended',
             formatInstallData(install, addon), addon);
    Metrics.experimentEnabled(addon.id);
    WebExtensionChannels.updateExperimentChannels();
  },
  onInstallFailed: function(install) {
    app.send('addon-install:install-failed', formatInstallData(install));
  },
  onInstallStarted: function(install) {
    app.send('addon-install:install-started', formatInstallData(install));
  },
  onNewInstall: function(install) {
    app.send('addon-install:install-new', formatInstallData(install));
  },
  onInstallCancelled: function(install) {
    app.send('addon-install:install-cancelled', formatInstallData(install));
  },
  onDownloadStarted: function(install) {
    app.send('addon-install:download-started', formatInstallData(install));
  },
  onDownloadProgress: function(install) {
    app.send('addon-install:download-progress', formatInstallData(install));
  },
  onDownloadEnded: function(install) {
    app.send('addon-install:download-ended', formatInstallData(install));
  },
  onDownloadCancelled: function(install) {
    app.send('addon-install:download-cancelled', formatInstallData(install));
  },
  onDownloadFailed: function(install) {
    app.send('addon-install:download-failed', formatInstallData(install));
  }
};
AddonManager.addInstallListener(installListener);

exports.main = function(options) {
  const reason = options.loadReason;

  loadEnvironment();

  if (!store.clientUUID) {
    // Generate a UUID for this client, so we can manage experiment
    // installations for multiple browsers per user. DO NOT USE IN METRICS.
    store.clientUUID = require('sdk/util/uuid').uuid().toString().slice(1, -1);
    store.firstRun = true;
  } else {
    store.firstRun = false;
  }

  Metrics.init();
  if (reason === 'install' || reason === 'enable') {
    Metrics.onEnable();
  }

  WebExtensionChannels.init();
  ToolbarButton.init(settings);
  ExperimentNotifications.init();
  SharePrompt.init(settings);

  if (reason === 'install') {
    openOnboardingTab();
  }

  const installedCount = (store.installedAddons) ? Object.keys(store.installedAddons).length : 0;
  Metrics.sendGAEvent({
    t: 'event',
    ec: 'add-on Interactions',
    ea: 'browser startup',
    el: installedCount
  });
};

exports.onUnload = function(reason) {
  prefs.off();
  AddonManager.removeAddonListener(addonListener);
  AddonManager.removeInstallListener(installListener);
  Metrics.destroy();
  WebExtensionChannels.destroy();
  ToolbarButton.destroy();
  ExperimentNotifications.destroy();
  SharePrompt.destroy(reason);

  if (reason === 'uninstall' || reason === 'disable') {
    Metrics.onDisable();
  }

  if (reason === 'uninstall') {
    survey.destroy();
    ExperimentNotifications.uninstall();

    if (store.installedAddons) {
      Object.keys(store.installedAddons).forEach(id => {
        uninstallExperiment({addon_id: id});
        ExperimentHacks.uninstalled(id);
      });
      delete store.installedAddons;
    }
    delete store.availableExperiments;

    app.send('addon-self:uninstalled');
  }
  app.destroy();
};
