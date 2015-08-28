/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the "License"). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

const {Cu} = require('chrome');
const self = require('sdk/self');
const tabs = require('sdk/tabs');
const {PageMod} = require('sdk/page-mod');
const {ActionButton} = require('sdk/ui/button/action');
const AddonManager = Cu.import('resource://gre/modules/AddonManager.jsm').AddonManager;
const prefs = require('sdk/simple-prefs').prefs;
const updates = require('./package.json').UPDATES;
const state = {updates: updates.map(function(u) {
  return u.title;
})};

const mod = new PageMod({
  include: prefs.ALLOWED_ORIGINS.split(','),
  contentScriptFile: self.data.url('message-bridge.js'),
  contentScriptWhen: 'start',
  onAttach: setupWorker
});

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


function sendToWeb(data) {
  mod.port.emit('from-addon-to-web', data);
}

function formatInstallData(install, addon) {
  let formatted = {
    'name': install.name ? install.name : '',
    'error': install.error,
    'state': install.state,
    'version': install.version ? install.version : '',
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

function installAddon(data) {
  AddonManager.getInstallForURL(data, function(install) {
    install.install();
  }, 'application/x-xpinstall');
}

function filterUpdates(approvedUpdates) {
  const filteredUpdates = [];
  approvedUpdates.forEach(function(appUpdate) {
    filteredUpdates.push(updates.find(function(update) {
      return update.title === appUpdate;
    }));
  });

  return filteredUpdates;
}

function triggerInstalls(approvedUpdates) {
  filterUpdates(approvedUpdates).forEach(function(update) {
    installAddon(update.url);
  });
}

function setupWorker() {
  if (self.loadReason === 'install') {
    sendToWeb({type: 'addon-self:installed'});
  } else if (self.loadReason === 'enable') {
    sendToWeb({type: 'addon-self:enabled'});
  } else if (self.loadReason === 'upgrade') {
    sendToWeb({type: 'addon-self:upgraded'});
  }

  mod.port.on('from-web-to-addon', function(msg) {
    if (!msg.type) { return; }
    switch (msg.type) {
      case 'update-check':
        sendToWeb({ type: 'addon-updates', detail: state.updates });
        break;
      case 'update-approve':
        state.updates = require('exclude')(state.updates, msg.detail);
        button.badge = state.updates.length;
        triggerInstalls(msg.detail);
        break;
      case 'loaded':
        sendToWeb({ type: 'addon-available' });
        break;
      default:
        sendToWeb({ type: 'echo', data: msg });
        break;
    }
  });

  const installListeners = {
    onInstallEnded: function(install, addon) {
      sendToWeb({type: 'addon-install:install-ended', detail: formatInstallData(install, addon)});
    },
    onInstallFailed: function(install) {
      sendToWeb({type: 'addon-install:install-failed', detail: formatInstallData(install)});
    },
    onInstallStarted: function(install) {
      sendToWeb({type: 'addon-install:install-started', detail: formatInstallData(install)});
    },
    onNewInstall: function(install) {
      sendToWeb({type: 'addon-install:install-new', detail: formatInstallData(install)});
    },
    onInstallCancelled: function(install) {
      sendToWeb({type: 'addon-install:install-cancelled', detail: formatInstallData(install)});
    },
    onDownloadStarted: function(install) {
      sendToWeb({type: 'addon-install:download-started', detail: formatInstallData(install)});
    },
    onDownloadProgress: function(install) {
      sendToWeb({type: 'addon-install:download-progress', detail: formatInstallData(install)});
    },
    onDownloadEnded: function(install) {
      sendToWeb({type: 'addon-install:download-ended', detail: formatInstallData(install)});
    },
    onDownloadCancelled: function(install) {
      sendToWeb({type: 'addon-install:download-cancelled', detail: formatInstallData(install)});
    },
    onDownloadFailed: function(install) {
      sendToWeb({type: 'addon-install:download-failed', detail: formatInstallData(install)});
    }
  };

  AddonManager.addInstallListener(installListeners);
}
