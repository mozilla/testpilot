/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

let app;
const store = require('sdk/simple-storage').storage;
const {Cu} = require('chrome');
const self = require('sdk/self');
const tabs = require('sdk/tabs');
const {PageMod} = require('sdk/page-mod');
const {ActionButton} = require('sdk/ui/button/action');
const request = require('sdk/request').Request;
const AddonManager = Cu.import('resource://gre/modules/AddonManager.jsm').AddonManager;
const prefs = require('sdk/simple-prefs').prefs;
const Router = require('./route');

const mod = new PageMod({
  include: prefs.ALLOWED_ORIGINS.split(','),
  contentScriptFile: self.data.url('message-bridge.js'),
  contentScriptWhen: 'start',
  attachTo: ['top', 'existing'],
  onAttach: setupApp
});

if (!store.experiments) store.experiments = {};
if (!store.availableExperiments) store.availableExperiments = [];

require('sdk/system/unload').when(function(reason) {
  if (reason === 'uninstall') {
    app.send('addon-self:uninstalled');
    if (store.experiments) {
      Object.keys(store.experiments).forEach(e => uninstall({addon_id: e}));
      delete store.experiments;
    }

    delete store.availableExperiments;
  }
});

ActionButton({ // eslint-disable-line new-cap
  id: 'idea-town-link',
  label: 'Idea Town',
  icon: {
    '16': './icon-16.png',
    '32': './icon-32.png',
    '64': './icon-64.png'
  },
  onClick: function() {
    tabs.open({ url: prefs.CONTENT_URL });
  }
});

function getInstalledAddons(cb) {
  request({
    url: 'http://ideatown.dev:8000/api/experiments?format=json',
    onComplete: res => {
      if (!res.json.results.length || res.error) {
        console.error('No experiments:: ', res);
      }

      store.availableExperiments = res.json.results.map(exp => {
        return exp.addon_id;
      });

      AddonManager.getAllAddons(addons => {
        addons.forEach(ex => {
          if (isIdeatownAddon) {
            store.experiments[ex.id] = ex.version;
          }
        });

        // send back to client as an array
        cb(Object.keys(store.experiments).map(k => {
          return {id: k, version: store.experiments[k]};
        }));
      });
    }
  }).get();
}

function setupApp() {
  app = new Router(mod);

  if (self.loadReason === 'install') {
    app.send('addon-self:installed');
  } else if (self.loadReason === 'enable') {
    app.send('addon-self:enabled');
  } else if (self.loadReason === 'upgrade') {
    app.send('addon-self:upgraded');
  }

  app.on('install-experiment', function(msg) {
    installExperiment(msg);
  });

  app.on('uninstall-experiment', function(msg) {
    uninstall(msg);
  });

  app.on('uninstall-all', function() {
    Object.keys(store.experiments).forEach(key => uninstall({addon_id: key}));
  });

  app.on('loaded', function() {
    getInstalledAddons(addons => {
      app.send('addon-available', {
        installed: addons
      });
    });
  });
}

function uninstall(experiment) {
  AddonManager.getAddonByID(experiment.addon_id, a => a.uninstall());
}

function installExperiment(experiment) {
  AddonManager.getInstallForURL(experiment.xpi_url, install => {
    install.install();
  }, 'application/x-xpinstall');
}

function formatInstallData(install, addon) {
  let formatted = {
    'name': install.name || '',
    'error': install.error,
    'state': install.state,
    'version': install.version || '',
    'progress': install.progress,
    'maxProgress': install.maxProgress
  };

  if (addon) {
    formatted = require('xtend')(formatted, {
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

AddonManager.addAddonListener({
  onUninstalling: function(addon) {
    if (isIdeatownAddon(addon.id)) {
      app.send('addon-uninstall:uninstall-started', {
        id: addon.id,
        name: addon.name,
        version: addon.version
      });
    }
  },
  onUninstalled: function(addon) {
    if (isIdeatownAddon(addon.id)) {
      app.send('addon-uninstall:uninstall-ended', {
        id: addon.id,
        name: addon.name,
        version: addon.version
      }, addon);

      if (store.experiments[addon.id]) {
        delete store.experiments[addon.id];
      }
    }
  }
});

function isIdeatownAddon(id) {
  return Boolean(store.availableExperiments.filter(ae => ae === id).length);
}

AddonManager.addInstallListener({
  onInstallEnded: function(install, addon) {
    if (isIdeatownAddon(addon.id)) {
      store.experiments[addon.id] = addon.version;
      app.send('addon-install:install-ended', formatInstallData(install, addon), addon);
    }
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
});
