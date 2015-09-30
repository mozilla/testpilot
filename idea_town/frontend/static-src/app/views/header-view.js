import app from 'ampersand-app';

import BaseView from './base-view';
import template from '../templates/header-view';

export default BaseView.extend({
  _template: template,

  events: {
    'click [data-hook=logout]': 'logout'
  },

  initialize() {
    // addon changes may be broadcast by the idea-town addon outside the
    // regular page load cycle, and those changes alter the header's appearance
    app.me.on('change:hasAddon', this.render, this);
  },

  render() {
    this.session = app.me.user.id;

    // an active user has an addon and a session
    this.activeUser = !!this.session && app.me.hasAddon;

    BaseView.prototype.render.apply(this, arguments);
  },

  // TODO: actually manage state without refreshing the page. for now, just refresh
  //       to pick up csrftoken cookie changes.
  logout(evt) {
    evt.preventDefault();
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
