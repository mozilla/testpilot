import app from 'ampersand-app';
import cookies from 'js-cookie';


export default function installAddon(view, eventCategory, callback) {
  const downloadUrl = '/static/addon/addon.xpi';

  view.query('[data-hook=install]').classList.add('state-change');
  view.query('.default-btn-msg').classList.add('no-display');
  view.query('.progress-btn-msg').classList.remove('no-display');

  app.sendToGA('event', {
    eventCategory: eventCategory,
    eventAction: 'button click',
    eventLabel: 'Install the Add-on',
    outboundURL: downloadUrl
  });

  cookies.set('first-run', 'true');

  // Wait for the add-on to be installed.
  // TODO: Should we have a timeout here, give up after a few intervals? If
  // user cancels add-on install, this will never stop spinning.
  const interval = setInterval(() => {
    if (!window.navigator.testpilotAddon) { return; }
    clearInterval(interval);
    app.me.fetch().then(() => {
      callback();
    }).catch(() => {
      // HACK (for Issue #1075): Timed out while waiting for the initial sync
      // message, so just reload the page to stop waiting.
      window.location.reload();
    });
  }, 1000);
}
