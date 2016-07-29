import app from 'ampersand-app';
import cookies from 'js-cookie';
import PageView from './page-view';
import template from '../templates/landing-page';
import ExperimentListView from './experiment-list-view';

export default PageView.extend({
  _template: template,

  pageTitle: 'Firefox Test Pilot - Help build Firefox',
  pageTitleL10nID: 'pageTitleLandingPage',

  skipHeader: true,

  events: {
    'click [data-hook=install]': 'installClicked'
  },

  render() {
    this.hasAddon = app.me.hasAddon;
    this.isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

    PageView.prototype.render.apply(this, arguments);

    if (!this.hasAddon) {
      this.renderSubview(new ExperimentListView({
        hasAddon: this.hasAddon,
        isFirefox: this.isFirefox
      }), '[data-hook="experiment-list"]');
    }

    const installedCount = (!this.hasAddon) ? null :
      Object.keys(app.me.installed || {}).length;
    const anyInstalled = (!this.hasAddon) ? null :
      (installedCount > 0);
    app.sendToGA('pageview', {
      'dimension1': this.hasAddon,
      'dimension2': anyInstalled,
      'dimension3': installedCount
    });
  },

  installClicked() {
    const downloadUrl = '/static/addon/addon.xpi';

    this.query('[data-hook=install]').classList.add('state-change');
    this.query('.default-btn-msg').classList.add('no-display');
    this.query('.progress-btn-msg').classList.remove('no-display');
    app.sendToGA('event', {
      eventCategory: 'HomePage Interactions',
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
        app.router.redirectTo('experiments');
      }).catch(() => {
        // HACK (for Issue #1075): Timed out while waiting for the initial sync
        // message, so just reload the page to stop waiting.
        window.location.reload();
      });
    }, 1000);
  },

  remove() {
    PageView.prototype.remove.apply(this, arguments);
  }
});
