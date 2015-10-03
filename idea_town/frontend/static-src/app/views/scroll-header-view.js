import app from 'ampersand-app';

import BaseView from './base-view';
import template from '../templates/scroll-header-view';
const changeHeaderOn = 120;

export default BaseView.extend({
  _template: template,

  events: {
    'click [data-hook=logout]': 'logout'
  },

  initialize(opts) {
    this.model = app.experiments.get(opts.slug, 'slug');
    this.didScroll = false;

    window.addEventListener('scroll', function scrollListener() {
      if (!this.didScroll) {
        this.didScroll = true;
        setTimeout(this.onScroll.bind(this), 200);
      }
    }.bind(this));
    app.me.on('change:hasAddon', this.render, this);
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

  render() {
    this.title = this.model.title;
    this.isInstalled = !!this.model.isInstalled;
    BaseView.prototype.render.apply(this, arguments);
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
