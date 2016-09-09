import app from 'ampersand-app';
import cookies from 'js-cookie';
import EmailDialogView from '../views/email-opt-in-dialog-view';


const MOZADDONMANAGER_ALLOWED_HOSTNAMES = [
  'testpilot.firefox.com',
  'testpilot.stage.mozaws.net',
  'testpilot.dev.mozaws.net'
];


function mozAddonManagerInstall(url) {
  return navigator.mozAddonManager.createInstall({ url }).then(install => {
    return new Promise((resolve, reject) => {
      install.addEventListener('onInstallEnded', () => resolve());
      install.addEventListener('onInstallFailed', () => reject());
      install.install();
    });
  });
}

function installAddon(view, eventCategory, callback) {
  const { protocol, hostname, port } = window.location;
  const path = '/static/addon/addon.xpi';
  const downloadUrl = `${protocol}//${hostname}${port ? ':' + port : ''}${path}`;

  view.query('[data-hook=install]').classList.add('state-change');
  view.query('.default-btn-msg').classList.add('no-display');
  view.query('.progress-btn-msg').classList.remove('no-display');

  const useMozAddonManager = (
    navigator.mozAddonManager &&
    protocol === 'https:' &&
    MOZADDONMANAGER_ALLOWED_HOSTNAMES.includes(hostname)
  );

  const gaEvent = {
    eventCategory: eventCategory,
    eventAction: 'button click',
    eventLabel: 'Install the Add-on'
  };

  if (useMozAddonManager) {
    app.sendToGA('event', gaEvent);
    mozAddonManagerInstall(downloadUrl).then(() => {
      console.log('Installed extension via mozAddonManager');
    });
  } else {
    gaEvent.outboundURL = downloadUrl;
    app.sendToGA('event', gaEvent);
  }

  // Wait for the add-on to be installed.
  // TODO: Should we have a timeout here, give up after a few intervals? If
  // user cancels add-on install, this will never stop spinning.
  const interval = setInterval(() => {
    if (!window.navigator.testpilotAddon) { return; }
    clearInterval(interval);
    cookies.set('first-run', 'true');
    app.me.fetch().then(() => {
      callback();
    }).catch(() => {
      // HACK (for Issue #1075): Timed out while waiting for the initial sync
      // message, so just reload the page to stop waiting.
      window.location.reload();
    });
  }, 1000);
}


function postInstallModal(view) {
  if (cookies.get('first-run')) {
    cookies.remove('first-run');
    view.renderSubview(new EmailDialogView({}), 'body');
  }
}

export { installAddon as default, postInstallModal };
