/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the "License"). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

let app;
const store = require('sdk/simple-storage').storage;
const {Cu} = require('chrome');
const self = require('sdk/self');
const tabs = require('sdk/tabs');
const {PageMod} = require('sdk/page-mod');
const {ActionButton} = require('sdk/ui/button/action');
const AddonManager = Cu.import('resource://gre/modules/AddonManager.jsm').AddonManager;
const prefs = require('sdk/simple-prefs').prefs;
const updates = require('./package.json').UPDATES;
const Router = require('./route');
const state = {updates: updates};

const mod = new PageMod({
  include: prefs.ALLOWED_ORIGINS.split(','),
  contentScriptFile: self.data.url('message-bridge.js'),
  contentScriptWhen: 'start',
  onAttach: setupApp
});

require('sdk/system/unload').when(function(reason) {
  if (reason === 'uninstall') {
    app.send('addon-self:uninstalled');
    if (store.experiments) {
      uninstall(store.experiments);
      delete store.experiments;
    }
  }
});

if (!store.experiments) store.experiments = [];

const button = ActionButton({ // eslint-disable-line new-cap
  id: 'idea-town-link',
  label: 'Idea Town',
  icon: {
    '16': './icon-16.png',
    '32': './icon-32.png',
    '64': './icon-64.png'
  },
  badge: state.updates.length,
  badgeColor: prefs.BADGE_COLOR,
  onClick: function() {
    tabs.open({ url: prefs.CONTENT_URL });
  }
});

function setupApp() {
  app = new Router(mod);

  if (self.loadReason === 'install') {
    app.send('addon-self:installed');
  } else if (self.loadReason === 'enable') {
    app.send('addon-self:enabled');
  } else if (self.loadReason === 'upgrade') {
    app.send('addon-self:upgraded');
  }

  app.on('update-check', function() {
    app.send('addon-updates', state.updates);
  });

  app.on('update-approve', function(msg) {
    const msgIds = msg.map(m => m.id);
    triggerInstalls(updates.filter(u => require('array-includes')(msgIds, u.id)));
  });

  app.on('uninstall-all', function() {
    uninstall(store.experiments);
  });

  app.on('uninstall', function(msg) {
    uninstall(msg);
  });

  app.on('loaded', function() {
    app.send('addon-available', {
      experiments: store.experiments,
      updates: state.updates
    });
  });
}

function uninstall(toUninstall) {
  toUninstall.forEach(u => {
    AddonManager.getAddonByID(u.id, function(a) {
      a.uninstall();
    });
  });
}

function triggerInstalls(approvedUpdates) {
  approvedUpdates.forEach(u => {
    AddonManager.getInstallForURL(u.url, function(install) {
      install.install();
    }, 'application/x-xpinstall');
  });
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
    app.send('addons-uninstalling', {
      id: addon.id,
      name: addon.name
    });
  },
  onUninstalled: function(addon) {
    app.send('addons-uninstalled', {
      id: addon.id,
      name: addon.name
    });

    store.experiments = store.experiments.filter(ex => ex.id !== addon.id);
    state.updates = require('exclude')(updates, store.experiments);
  }
});

AddonManager.addInstallListener({
  onInstallEnded: function(install, addon) {
    store.experiments.push(state.updates.find(u => u.id === addon.id));
    state.updates = state.updates.filter(u => u.id !== addon.id);
    button.badge = state.updates.length;
    app.send('addon-install:install-ended', formatInstallData(install, addon));
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
