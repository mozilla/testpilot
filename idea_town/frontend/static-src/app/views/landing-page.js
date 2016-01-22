import app from 'ampersand-app';

import PageView from './page-view';
import template from '../templates/landing-page';

export default PageView.extend({
  _template: template,

  pageTitle: 'Idea Town - Help build Firefox',
  pageTitleL10nID: 'pageTitleLandingPage',

  events: {
    'click [data-hook=show-beta-notice]': '_showBetaNotice'
  },

  render() {
    const isLoggedIn = !!app.me.user.id;
    this.loggedIn = isLoggedIn;
    this.downloadUrl = isLoggedIn && app.me.user.addon.url;

    // TODO: setting styles and ids on body seems funny
    if (this.loggedIn) {
      document.body.classList.add('add-on');
    } else {
      document.body.classList.add('sign-up');
    }
    // save the old ID, if there was one
    document.body._id = document.body.id;
    document.body.id = 'cta';
    PageView.prototype.render.apply(this, arguments);
  },

  remove() {
    document.body.classList.remove('add-on');
    document.body.classList.remove('sign-up');
    document.body.id = document.body._id;

    PageView.prototype.remove.apply(this, arguments);
  },

  _showBetaNotice(evt) {
    evt.preventDefault();
    const betaNotice = document.getElementById('beta-notice-modal');
    const copter = document.getElementById('copter');
    const modalScreen = document.getElementById('modal-screen');
    betaNotice.classList.remove('hidden');
    betaNotice.classList.add('delayed-fade-in');
    copter.classList.remove('hover');
    copter.classList.add('fly-up');
    modalScreen.classList.remove('no-display');
    modalScreen.classList.add('fade-in');
  }

});
