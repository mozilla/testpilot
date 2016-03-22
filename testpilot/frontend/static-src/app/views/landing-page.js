import app from 'ampersand-app';
import PageView from './page-view';
import template from '../templates/landing-page';
import ExperimentListView from './experiment-list-view';

// TODO back out this commit (78bd0a93a1q) before launch.
import queryString from 'query-string';

export default PageView.extend({
  _template: template,

  pageTitle: 'Firefox Test Pilot - Help build Firefox',
  pageTitleL10nID: 'pageTitleLandingPage',

  events: {
    'click .centered-banner': 'installClicked'
  },

  render() {
    const isLoggedIn = !!app.me.user.id;
    const query = queryString.parse(location.search);
    this.isMoz = query.hasOwnProperty('butimspecial');
    this.loggedIn = isLoggedIn;
    this.addonInstalled = app.me.hasAddon;
    this.downloadUrl = isLoggedIn && app.me.user.addon.url;
    this.isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

    PageView.prototype.render.apply(this, arguments);

    if (!this.loggedIn && this.isMoz) {
      this.renderSubview(new ExperimentListView({
        loggedIn: this.loggedIn,
        isFirefox: this.isFirefox
      }), '[data-hook="experiment-list"]');
    }
  },

  installClicked() {
    const btn = this.query('[data-hook=install]');
    btn.classList.add('state-change');
    this.query('.default-btn-msg').classList.add('no-display');
    this.query('.progress-btn-msg').classList.remove('no-display');

    const interval = setInterval(() => {
      if (window.navigator.testpilotAddon) {
        clearInterval(interval);
        app.webChannel.sendMessage('show-installed-panel', {});
        document.querySelector('.button.default').classList.remove('state-change');

        const msg = this.query('[data-hook=installed-message]');
        msg.classList.remove('no-display');
        this.query('[data-hook=default-message]').classList.add('no-display');
        msg.querySelector('.button').onclick = () => {
          app.webChannel.sendMessage('hide-installed-panel', {});
        };

        // Show the "Let's go" button if the installed-panel is
        // dismissed.
        app.once('webChannel:addon-self:install-panel-dismissed', () => {
          msg.querySelector('.button').classList.remove('no-display');
        });
      }
    }, 1000);
  },

  remove() {
    PageView.prototype.remove.apply(this, arguments);
  }
});
