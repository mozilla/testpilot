import app from 'ampersand-app';

import BaseView from './base-view';
import template from '../templates/landing-page';

export default BaseView.extend({
  _template: template,

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

    BaseView.prototype.render.apply(this, arguments);
  },

  remove() {
    document.body.classList.remove('add-on');
    document.body.classList.remove('sign-up');
    document.body.id = document.body._id;

    BaseView.prototype.remove.apply(this, arguments);
  }
});
