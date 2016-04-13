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
    'click [data-hook=install]': 'installClicked',
    'click [data-hook=get-started-with-account]': 'getStarted',
    'click [data-hook=signin]': 'signin'
  },

  props: {
    loginUrl: {type: 'string', default: '/accounts/login/?next=/'}
  },

  bindings: {
    'loginUrl': [{
      type: 'attribute',
      name: 'href',
      hook: 'signin'
    }, {
      type: 'attribute',
      name: 'href',
      hook: 'get-started-with-account'
    }]
  },

  render() {
    const isLoggedIn = !!app.me.user.id;
    const query = queryString.parse(location.search);
    this.isMoz = query.hasOwnProperty('butimspecial') || query.hasOwnProperty('butimspecial/');
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

    app.sendToGA('pageview', {
      'dimension1': this.loggedIn
    });
  },

  installClicked() {
    this.query('[data-hook=install]').classList.add('state-change');
    this.query('.default-btn-msg').classList.add('no-display');
    this.query('.progress-btn-msg').classList.remove('no-display');
    app.sendToGA('event', {
      eventCategory: 'HomePage Interactions',
      eventAction: 'button click',
      eventLabel: 'Install the Add-on',
      outboundURL: this.downloadUrl
    });

    const interval = setInterval(() => {
      if (window.navigator.testpilotAddon) {
        clearInterval(interval);
        app.webChannel.sendMessage('show-installed-panel', {});
        this.query('.button.large.primary').classList.remove('state-change');

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

  getStarted() {
    app.sendToGA('event', {
      eventCategory: 'HomePage Interactions',
      eventAction: 'button click',
      eventLabel: 'Get started with a Firefox Account',
      outboundURL: this.loginUrl
    });
  },

  signin() {
    app.sendToGA('event', {
      eventCategory: 'HomePage Interactions',
      eventAction: 'button click',
      eventLabel: 'Sign in',
      outboundURL: this.loginUrl
    });
  },

  remove() {
    PageView.prototype.remove.apply(this, arguments);
  }
});
