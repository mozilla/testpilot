import app from 'ampersand-app';

import ExperimentListView from './experiment-list-view';
import installAddon from '../lib/install-addon';
import template from '../templates/landing-page';
import PageView from './page-view';


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
    installAddon(this, 'HomePage Interactions', () => {
      app.router.redirectTo('experiments');
    });
  },

  remove() {
    PageView.prototype.remove.apply(this, arguments);
  }
});
