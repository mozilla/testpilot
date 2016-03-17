/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

/* global TelemetryController */

const settings = {};

let setInstalledFlagPageMod;
let messageBridgePageMod;
let button;
let app;

const {Cc, Ci, Cu} = require('chrome');

Cu.import('resource://gre/modules/TelemetryController.jsm');

const AddonManager = Cu.import('resource://gre/modules/AddonManager.jsm').AddonManager;
const Prefs = Cu.import('resource://gre/modules/Preferences.jsm').Preferences;
const cookieManager2 = Cc['@mozilla.org/cookiemanager;1']
                       .getService(Ci.nsICookieManager2);

const self = require('sdk/self');
const store = require('sdk/simple-storage').storage;
const {Panel} = require('sdk/panel');
const {PageMod} = require('sdk/page-mod');
const {ToggleButton} = require('sdk/ui/button/toggle');
const request = require('sdk/request').Request;
const simplePrefs = require('sdk/simple-prefs');
const URL = require('sdk/url').URL;

const Events = require('sdk/system/events');

const Mustache = require('mustache');
const templates = require('./lib/templates');
Mustache.parse(templates.feedback);
Mustache.parse(templates.experimentList);

const PANEL_WIDTH = 400;
const EXPERIMENT_HEIGHT = 95;
const FOOTER_HEIGHT = 60;

// Generate a UUID for this client, if we don't have one yet.
if (!store.clientUUID) {
  store.clientUUID = generateUUID();
}

// Canned selectable server environment configs
const SERVER_ENVIRONMENTS = {
  local: {
    BASE_URL: 'http://testpilot.dev:8000',
    TESTPILOT_PREFIX: 'testpilot.addon.LOCAL.',
    WHITELIST_URLS: 'https://www.mozilla.org/*,about:home',
    BADGE_COLOR: '#AA00AA'
  },
  dev: {
    BASE_URL: 'http://testpilot-dev.us-east-1.elasticbeanstalk.com',
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

function updatePrefs() {
  // Select the environment, with production as a default.
  const envName = simplePrefs.prefs.SERVER_ENVIRONMENT;
  const env = (envName in SERVER_ENVIRONMENTS) ?
    SERVER_ENVIRONMENTS[envName] : SERVER_ENVIRONMENTS.production;

  // Update the settings from selected environment
  Object.assign(settings, {
    BASE_URL: env.BASE_URL,
    ALLOWED_ORIGINS: env.BASE_URL + '/*',
    ALLOWED_ORIGINS_VIEWINSTALLEDFLAG: env.BASE_URL + '/*,' + env.WHITELIST_URLS,
    HOSTNAME: URL(env.BASE_URL).hostname, // eslint-disable-line new-cap
    TESTPILOT_PREFIX: env.TESTPILOT_PREFIX
  });

  // Destroy previously existing PageMods
  if (setInstalledFlagPageMod) { setInstalledFlagPageMod.destroy(); }
  if (messageBridgePageMod) { messageBridgePageMod.destroy(); }

  // Set up new PageMod for read access to detect Test Pilot installation.
  setInstalledFlagPageMod = new PageMod({
    include: settings.ALLOWED_ORIGINS_VIEWINSTALLEDFLAG.split(','),
    contentScriptFile: './set-installed-flag.js',
    contentScriptWhen: 'start',
    attachTo: ['top', 'existing']
  });

  // Set up new PageMod for ability to install/remove add-ons.
  messageBridgePageMod = new PageMod({
    include: settings.ALLOWED_ORIGINS.split(','),
    contentScriptFile: './message-bridge.js',
    contentScriptWhen: 'start',
    attachTo: ['top', 'existing'],
    onAttach: setupApp
  });
}

// Register handler to reconfigure on pref change, kick off initial
// prefs-dependent setup
simplePrefs.on('SERVER_ENVIRONMENT', updatePrefs);
updatePrefs();

function setupApp() {
  updateExperiments().then(() => {
    app = new Router(messageBridgePageMod);

    app.on('install-experiment', installExperiment);

    app.on('uninstall-experiment', uninstallExperiment);

    app.on('uninstall-all', function() {
      for (let id of store.installedAddons) { // eslint-disable-line prefer-const
        uninstallExperiment({addon_id: id});
      }
    });

    app.on('sync-installed', serverInstalled => {
      syncAllAddonInstallations(serverInstalled).then(() => {
        app.send('sync-installed-result', {
          clientUUID: store.clientUUID,
          installed: store.installedAddons
        });
      });
    });

    if (self.loadReason === 'install') {
      app.send('addon-self:installed');
    } else if (self.loadReason === 'enable') {
      app.send('addon-self:enabled');
    } else if (self.loadReason === 'upgrade') {
      app.send('addon-self:upgraded');
    }
  });
}

const panel = Panel({ // eslint-disable-line new-cap
  contentURL: './feedback.html',
  contentScriptFile: './panel.js',
  onHide: () => {
    button.state('window', {checked: false});
  }
});

panel.on('show', showExperimentList);
panel.port.on('back', showExperimentList);

function showExperimentList() {
  panel.port.emit('show', getExperimentList(store.availableExperiments,
                                            store.installedAddons));
}

panel.port.on('link', url => {
  require('sdk/tabs').open(url);
  panel.hide();
});

panel.port.on('launch-feedback', id => {
  panel.port.emit('show', getFeedbackForm(id));
});

panel.port.on('feedback-submit', dataStr => {
  const data = JSON.parse(dataStr);
  data.tags = ['main-addon'];
  panel.hide();
});

function getFeedbackForm(id) {
  return Mustache.render(templates.feedback, {
    experiment: store.availableExperiments[id]
  });
}

function getExperimentList(availableExperiments, installedAddons) {
  return Mustache.render(templates.experimentList, {
    base_url: settings.BASE_URL,
    experiments: Object.keys(availableExperiments).map(k => {
      availableExperiments[k].active = Boolean(installedAddons[k]);
      return availableExperiments[k];
    })
  });
}

// update the our icon for devtools themes
Prefs.observe('devtools.theme', pref => {
  setToggleButton(pref === 'dark');
});
setToggleButton(Prefs.get('devtools.theme') === 'dark');

function setToggleButton(dark) {
  const iconPrefix = dark ? './icon-inverted' : './icon';

  button = ToggleButton({ // eslint-disable-line new-cap
    id: 'testpilot-link',
    label: 'Test Pilot',
    icon: {
      '16': iconPrefix + '-16.png',
      '32': iconPrefix + '-32.png',
      '64': iconPrefix + '-64.png'
    },
    onChange: handleToolbarButtonChange
  });
}

function handleToolbarButtonChange(state) {
  if (!state.checked) { return; }
  const experimentCount = ('availableExperiments' in store) ?
    Object.keys(store.availableExperiments).length : 0;
  panel.show({
    width: PANEL_WIDTH,
    height: (experimentCount * EXPERIMENT_HEIGHT) + FOOTER_HEIGHT,
    position: button
  });
}

const EVENT_SEND_METRIC = 'testpilot::send-metric';

function onMetricsPing(ev) {
  const { subject, data } = ev;
  const dataParsed = JSON.parse(data);

  // TODO: The subject is add-on ID, could map to ping types as needed.
  const pingType = 'testpilottest';

  const payload = {
    version: 1,
    test: subject,
    payload: dataParsed
  };

  TelemetryController.submitExternalPing(pingType, payload, {
    addClientId: true,
    addEnvironment: true
  });
}
Events.on(EVENT_SEND_METRIC, onMetricsPing);

function Router(mod) {
  this.mod = mod;
  this._events = {};
  this.mod.port.on('from-web-to-addon', function(evt) {
    if (this._events[evt.type]) this._events[evt.type](evt.data);
  }.bind(this));
  return this;
}

Router.prototype.on = function(name, f) {
  this._events[name] = f;
  return this;
};

Router.prototype.send = function(name, data) {
  this.mod.port.emit('from-addon-to-web', {type: name, data: data});
  return this;
};

function updateExperiments() {
  // Fetch the list of available experiments
  return requestAPI({
    url: settings.BASE_URL + '/api/experiments'
  }).then(res => {
    // Index the available experiments by addon ID
    store.availableExperiments = {};
    res.json.results.forEach(exp => {
      store.availableExperiments[exp.addon_id] = exp;
    });

    // Query all installed addons
    return new Promise(resolve => AddonManager.getAllAddons(resolve));
  }).then(addons => {
    // Filter addons by known experiments, index by ID
    store.installedAddons = {};
    addons.filter(addon => isTestpilotAddonID(addon.id))
          .forEach(addon => store.installedAddons[addon.id] = addon);
    return store.installedAddons;
  });
}

function syncAllAddonInstallations(serverInstalled) {
  const availableIDs = Object.keys(store.availableExperiments);
  const clientIDs = Object.keys(store.installedAddons);
  const serverIDs = serverInstalled
    .filter(item => item.client_id === store.clientUUID)
    .map(item => item.addon_id);

  return Promise.all(availableIDs.filter(id => {
    const cidx = clientIDs.indexOf(id);
    const sidx = serverIDs.indexOf(id);
    // Both missing? Okay.
    if (cidx === -1 && sidx === -1) { return false; }
    // Both found? Okay.
    if (cidx !== -1 && sidx !== -1) { return false; }
    // One found, one not? Better sync.
    return true;
  }).map(syncAddonInstallation));
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

function formatInstallData(install, addon) {
  const formatted = {
    'name': install.name || '',
    'error': install.error,
    'state': install.state,
    'version': install.version || '',
    'progress': install.progress,
    'maxProgress': install.maxProgress
  };

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
  return 'availableExperiments' in store && id in store.availableExperiments;
}

function syncAddonInstallation(addonID) {
  const experiment = store.availableExperiments[addonID];
  const method = (addonID in store.installedAddons) ? 'put' : 'delete';
  // HACK: Use the same "done" handler for 2xx & 4xx responses -
  // 200 = PUT success, 410 = DELETE success, 404 = DELETE redundant
  const done = (res) => [addonID, method, res.status];
  return requestAPI({
    method: method,
    url: experiment.installations_url + store.clientUUID
  }).then(done, done);
}

function requestAPI(opts) {
  const headers = {
    'Accept': 'application/json',
    'Cookie': ''
  };

  const hostname = settings.HOSTNAME;
  const cookieEnumerator = cookieManager2.getCookiesFromHost(hostname);
  while (cookieEnumerator.hasMoreElements()) {
    const c = cookieEnumerator.getNext().QueryInterface(Ci.nsICookie); // eslint-disable-line new-cap
    headers.Cookie += c.name + '=' + c.value + ';';
    if (c.name === 'csrftoken') {
      headers['X-CSRFToken'] = c.value;
    }
  }

  return new Promise((resolve, reject) => {
    request({
      url: opts.url,
      headers: Object.assign(headers, opts.headers || {}),
      contentType: 'application/json',
      onComplete: res => (res.status < 400) ? resolve(res) : reject(res)
    })[opts.method || 'get']();
  });
}

// source: http://jsfiddle.net/briguy37/2mvfd/
function generateUUID() {
  let d = new Date().getTime();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

const addonListener = {
  onUninstalling: function(addon) {
    if (isTestpilotAddonID(addon.id)) {
      app.send('addon-uninstall:uninstall-started', {
        id: addon.id,
        name: addon.name,
        version: addon.version
      });
    }
  },
  onUninstalled: function(addon) {
    if (isTestpilotAddonID(addon.id)) {
      app.send('addon-uninstall:uninstall-ended', {
        id: addon.id,
        name: addon.name,
        version: addon.version
      }, addon);

      if (store.installedAddons[addon.id]) {
        delete store.installedAddons[addon.id];
        syncAddonInstallation(addon.id);
      }
    }
  }
};
AddonManager.addAddonListener(addonListener);

const installListener = {
  onInstallEnded: function(install, addon) {
    if (!isTestpilotAddonID(addon.id)) { return; }
    store.installedAddons[addon.id] = addon;
    syncAddonInstallation(addon.id).then(() => {
      app.send('addon-install:install-ended',
               formatInstallData(install, addon), addon);
    });
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

exports.onUnload = function(reason) {
  AddonManager.removeAddonListener(addonListener);
  AddonManager.removeInstallListener(installListener);
  panel.destroy();
  button.destroy();
  Events.off(EVENT_SEND_METRIC, onMetricsPing);
  setInstalledFlagPageMod.destroy();
  messageBridgePageMod.destroy();
  if (reason === 'uninstall') {
    app.send('addon-self:uninstalled');
    if (store.installedAddons) {
      for (let id of store.installedAddons) { // eslint-disable-line prefer-const
        uninstallExperiment({addon_id: id});
      }
      delete store.installedAddons;
    }
    delete store.availableExperiments;
  }
};
