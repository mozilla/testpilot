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

  render() {
    const isLoggedIn = !!app.me.user.id;
    const query = queryString.parse(location.search);
    this.isMoz = ('butimspecial' in query);
    this.loggedIn = isLoggedIn;
    this.addonInstalled = app.me.hasAddon;
    this.isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

    PageView.prototype.render.apply(this, arguments);

    if (!this.loggedIn && this.isMoz) {
      this.renderSubview(new ExperimentListView({
        loggedIn: this.loggedIn,
        isFirefox: this.isFirefox,
        skipHeader: true
      }), '[data-hook="experiment-list"]');
    }

    app.sendToGA('pageview', {
      'dimension1': this.loggedIn
    });
  },

  installClicked() {
    const isLoggedIn = !!app.me.user.id;
    const downloadUrl = isLoggedIn && app.me.user.addon.url;
    this.query('[data-hook=install]').classList.add('state-change');
    this.query('.default-btn-msg').classList.add('no-display');
    this.query('.progress-btn-msg').classList.remove('no-display');
    app.sendToGA('event', {
      eventCategory: 'HomePage Interactions',
      eventAction: 'button click',
      eventLabel: 'Install the Add-on',
      outboundURL: downloadUrl
    });

    const interval = setInterval(() => {
      if (window.navigator.testpilotAddon) {
        clearInterval(interval);
        app.webChannel.sendMessage('show-installed-panel', {});
        document.querySelector('.button.primary').classList.remove('state-change');

        const msg = this.query('[data-hook=installed-message]');
        msg.classList.remove('no-display');
        this.query('[data-hook=default-message]').classList.add('no-display');
        msg.querySelector('.button').onclick = () => {
          app.webChannel.sendMessage('hide-installed-panel', {});
        };
      }
    }, 1000);
  },

  getStarted(evt) {
    evt.preventDefault();
    app.sendToGA('event', {
      eventCategory: 'HomePage Interactions',
      eventAction: 'button click',
      eventLabel: 'Get started with a Firefox Account',
      outboundURL: '/accounts/login/?next=/'
    });
  },

  signin(evt) {
    evt.preventDefault();
    app.sendToGA('event', {
      eventCategory: 'HomePage Interactions',
      eventAction: 'button click',
      eventLabel: 'Sign in',
      outboundURL: '/accounts/login/?next=/'
    });
  },

  remove() {
    PageView.prototype.remove.apply(this, arguments);
  }
});
