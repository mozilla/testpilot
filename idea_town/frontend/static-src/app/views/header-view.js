import app from 'ampersand-app';
import BaseView from './base-view';

import template from '../templates/header-view';
import scrollTemplate from '../templates/scroll-header-view';
const changeHeaderOn = 100;

export default BaseView.extend({
  _template: template,

  events: {
    'click [data-hook=logout]': 'logout'
  },

  initialize(opts) {
    if (opts.headerScroll) {
      const chunkedUrl = location.pathname.split('/');
      if (chunkedUrl.length < 2) {
        return;
      }
      this._template = scrollTemplate;
      this.model = app.experiments.get(chunkedUrl[2], 'slug');
      this.didScroll = false;

      window.addEventListener('scroll', function scrollListener() {
        if (!this.didScroll) {
          this.didScroll = true;
          setTimeout(this.onScroll.bind(this), 200);
        }
      }.bind(this));
    }

    // addon changes may be broadcast by the idea-town addon outside the
    // regular page load cycle, and those changes alter the header's
    // appearance
    app.me.on('change:hasAddon', this.render, this);
  },

  render() {
    this.session = app.me.user.id;

    // an active user has an addon and a session
    this.activeUser = !!this.session && app.me.hasAddon;
    this.avatar = !!this.session && app.me.user.profile.avatar;

    if (this.model) {
      this.title = this.model.title;
      this.isInstalled = !!this.model.isInstalled;
    }

    BaseView.prototype.render.apply(this, arguments);
  },

  onScroll() {
    const sy = window.pageYOffset || document.documentElement.scrollTop;
    if (sy >= changeHeaderOn) {
      this.scrolled = true;
    } else {
      this.scrolled = false;
    }
    this.render();
    this.didScroll = false;
  },

  // TODO: actually manage state without refreshing the page. for now, just refresh
  //       to pick up csrftoken cookie changes.
  logout() {
    fetch('/accounts/logout/', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'X-CSRFTOKEN': app.me.csrfToken }
    }).then(() => {
      window.location.reload();
    }).catch((err) => {
      // for now, log the error in the console & do nothing in the UI
      console && console.error(err); // eslint-disable-line no-console
    });
  }
});
