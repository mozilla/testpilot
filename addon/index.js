/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

const settings = {};

let setInstalledFlagPageMod;
let messageBridgePageMod;
let button;
let app;

const {Cc, Ci, Cu} = require('chrome');

const AddonManager = Cu.import('resource://gre/modules/AddonManager.jsm').AddonManager;

const Prefs = Cu.import('resource://gre/modules/Preferences.jsm').Preferences;
const cookieManager2 = Cc['@mozilla.org/cookiemanager;1']
                       .getService(Ci.nsICookieManager2);

const self = require('sdk/self');
const store = require('sdk/simple-storage').storage;
const {Panel} = require('sdk/panel');
const {PageMod} = require('sdk/page-mod');
const tabs = require('sdk/tabs');
const {ToggleButton} = require('sdk/ui/button/toggle');
const request = require('sdk/request').Request;
const simplePrefs = require('sdk/simple-prefs');
const querystring = require('sdk/querystring');
const URL = require('sdk/url').URL;
const history = require('sdk/places/history');

const Mustache = require('mustache');
const templates = require('./lib/templates');
Mustache.parse(templates.installed);
Mustache.parse(templates.experimentList);

const Metrics = require('./lib/metrics');
const survey = require('./lib/survey');

const PANEL_WIDTH = 300;
const FOOTER_HEIGHT = 50;
const EXPERIMENT_HEIGHT = 80;
const INSTALLED_PANEL_HEIGHT = 300;

// Canned selectable server environment configs
const SERVER_ENVIRONMENTS = {
  local: {
    BASE_URL: 'http://testpilot.dev:8000',
    TESTPILOT_PREFIX: 'testpilot.addon.LOCAL.',
    WHITELIST_URLS: 'https://www.mozilla.org/*,about:home',
    BADGE_COLOR: '#AA00AA'
  },
  dev: {
    BASE_URL: 'http://testpilot.dev.mozaws.net',
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

  // kickoff our random experiment surveys
  survey.init();

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

function initServerEnvironmentPreference() {
  // Search recent browser history for visits to known server environments.
  // HACK: Docs say that multiple queries get OR'ed together, but that doesn't
  // seem to work. So, let's use Promise.all() to fire off multiple queries and
  // collate them ourselves.
  const envNames = Object.keys(SERVER_ENVIRONMENTS);
  Promise.all(envNames.map(name => new Promise(resolve => {
    history.search(
      {url: SERVER_ENVIRONMENTS[name].BASE_URL + '/*'},
      {count: 1, sort: 'date', descending: true}
    ).on('end', results => {
      // Map the history search into the name of the environment and the time
      // of the last visit, using null if there was no visit found.
      return resolve({
        name: name,
        time: results.length ? results[0].time : null
      });
    });
  }))).then(resultsRaw => {
    // Filter out non-results and sort in descending time order.
    const results = resultsRaw.filter(item => item.time !== null);
    results.sort((a, b) => b.time - a.time);

    // First result is the last visited environment.
    const lastVisitedName = results.length > 0 ? results[0].name : null;
    const currName = simplePrefs.prefs.SERVER_ENVIRONMENT;

    if (lastVisitedName && lastVisitedName !== currName) {
      // Switch to the last visited environment.
      simplePrefs.prefs.SERVER_ENVIRONMENT = lastVisitedName;
    }

    // Finally, watch for pref changes, kick off the env setup.
    simplePrefs.on('SERVER_ENVIRONMENT', updatePrefs);
    updatePrefs();
  });
}

function setupApp() {
  updateExperiments().then(() => {
    app = new Router(messageBridgePageMod);

    app.on('uninstall-self', uninstallSelf);

    app.on('install-experiment', installExperiment);

    app.on('uninstall-experiment', uninstallExperiment);

    app.on('sync-installed', serverInstalled => {
      syncAllAddonInstallations(serverInstalled).then(() => {
        app.send('sync-installed-result', {
          clientUUID: store.clientUUID,
          installed: store.installedAddons
        });
      });
    });

    app.on('show-installed-panel', () => {
      const installMsgPanel = Panel({ // eslint-disable-line new-cap
        contentURL: './base.html',
        contentScriptFile: './panel.js',
        onShow: () => installMsgPanel.port.emit('show', templates.installed)
      });

      installMsgPanel.on('hide', () => {
        app.send('addon-self:install-panel-dismissed');
      });

      function destroyInstallPanel() {
        if (installMsgPanel) {
          installMsgPanel.destroy();
        }
      }

      // get the test pilot tab and listen for deactivate or
      // close events, so we can hide the 'installed' panel.
      // BUG(DJ): deactivate event won't fire first time through
      // https://bugzilla.mozilla.org/show_bug.cgi?id=1230816
      let tab;
      for (tab of tabs) {
        if (tab.url.includes(settings.BASE_URL)) {
          tab.on('close', destroyInstallPanel);
          tab.on('deactivate', destroyInstallPanel);
        }
      }

      installMsgPanel.show({width: PANEL_WIDTH,
                            height: INSTALLED_PANEL_HEIGHT,
                            position: button});

      // allow us to hide the panel from a landing page interaction
      app.on('hide-installed-panel', destroyInstallPanel);
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
  contentURL: './base.html',
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
  tabs.open(url);
  panel.hide();
});

function getParams(title) {
  return querystring.stringify({
    utm_source: 'testpilot-addon',
    utm_medium: 'firefox-browser',
    utm_campaign: 'testpilot-doorhanger',
    utm_content: title
  });
}

function getExperimentList(availableExperiments, installedAddons) {
  return Mustache.render(templates.experimentList, {
    base_url: settings.BASE_URL,
    view_all_params: getParams('view-all-experiments'),
    experiments: Object.keys(availableExperiments).map(k => {
      if (installedAddons[k]) {
        availableExperiments[k].active = installedAddons[k].active;
      }
      availableExperiments[k].params = getParams(availableExperiments[k].title);
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
          .forEach(addon => {
            store.installedAddons[addon.id] = Object.assign({
              active: addon.isActive,
              installDate: addon.installDate
            }, store.availableExperiments[addon.id]);
          });
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

function uninstallSelf() {
  // First, kick out all the experiment add-ons
  Object.keys(store.installedAddons).forEach(id => {
    uninstallExperiment({addon_id: id});
  });
  // Then, uninstall ourselves
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
  const reqUrl = new URL(opts.url);

  const headers = {
    // HACK: Use the API origin as Referer to make CSRF checking happy on SSL
    'Referer': reqUrl.origin,
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

const addonListener = {
  onEnabled: function(addon) {
    if (isTestpilotAddonID(addon.id)) {
      store.installedAddons[addon.id] = addon;
      app.send('addon-manage:enabled', {
        id: addon.id,
        name: addon.name,
        version: addon.version
      });
      Metrics.experimentEnabled(addon.id);
    }
  },
  onDisabled: function(addon) {
    if (isTestpilotAddonID(addon.id)) {
      store.installedAddons[addon.id] = addon;
      app.send('addon-manage:disabled', {
        id: addon.id,
        name: addon.name,
        version: addon.version
      });
      Metrics.experimentDisabled(addon.id);
    }
  },
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

      Metrics.experimentDisabled(addon.id);
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
    Metrics.experimentEnabled(addon.id);
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

  if (!store.clientUUID) {
    // Generate a UUID for this client, so we can manage experiment
    // installations for multiple browsers per user. DO NOT USE IN METRICS.
    store.clientUUID = require('sdk/util/uuid').uuid().toString().slice(1, -1);
  }

  if (reason === 'install' || reason === 'enable') {
    Metrics.onEnable();
  }

  initServerEnvironmentPreference();
  Metrics.init();
};

exports.onUnload = function(reason) {
  AddonManager.removeAddonListener(addonListener);
  AddonManager.removeInstallListener(installListener);
  panel.destroy();
  button.destroy();
  Metrics.destroy();
  survey.destroy();

  if (reason === 'uninstall' || reason === 'disable') {
    Metrics.onDisable();
  }

  if (reason === 'uninstall') {
    if (store.installedAddons) {
      Object.keys(store.installedAddons).forEach(id => {
        uninstallExperiment({addon_id: id});
      });
      delete store.installedAddons;
    }
    delete store.availableExperiments;

    if (app) app.send('addon-self:uninstalled');
  }

  setInstalledFlagPageMod.destroy();
  messageBridgePageMod.destroy();
};
