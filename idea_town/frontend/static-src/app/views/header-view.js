import app from 'ampersand-app';

import BaseView from './base-view';

export default BaseView.extend({
  _template: `<section class="navbar">
                 Logged in as {{session}} <button data-hook="logout">Log out</button>
               </section>`,

  events: {
    'click [data-hook=logout]': 'logout'
  },

  initialize() {
    // since we reload the page on every session change, no need to observe
    // the model; just treat it as a static data structure
    this.session = app.me.user.id;
  },

  render() {
    // don't render unless there's a session
    if (!this.session) {
      return;
    }
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
