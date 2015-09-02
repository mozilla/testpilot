import app from 'ampersand-app';
import mustache from 'mustache';
import xhr from 'xhr';
import View from 'ampersand-view';

export default View.extend({
  // 'this' is passed into mustache, so this.session will be available as 'session'
  _template: `<section class="navbar">
               {{#session}}
                 Logged in as {{session}} <button data-hook="logout">Log out</button>
               {{/session}}
               {{^session}}
                 Howdy, stranger <button data-hook="login">Log in</button>
               {{/session}}
               </section>`,

  template(ctx) {
    return mustache.render(this._template, ctx);
  },

  events: {
    'click [data-hook=login]': 'login',
    'click [data-hook=logout]': 'logout'
  },

  initialize() {
    // since we reload the page on every session change, no need to observe
    // the model; just treat it as a static data structure
    this.session = app.me.session;
  },

  // TODO: if we intend to allow people to login from many different pages,
  //       we shouldn't redirect to / using the 'next' param; instead, 'next'
  //       should take the user back to the page they were on when the login
  //       flow began. however, it seems like we'll gatekeep everything behind
  //       a login page, in which case, the redirect will be static.
  login(evt) {
    evt.preventDefault();
    // redirect to start the django-allauth fxa flow
    // TODO: refactor. seems like the app, not a random view, should own window.location
    window.location = '/accounts/login/?next=/';
  },

  // TODO: actually manage state without refreshing the page. for now, just refresh
  //       to pick up csrftoken cookie changes.
  logout(evt) {
    evt.preventDefault();
    xhr({
      method: 'POST',
      uri: '/accounts/logout/',
      headers: {
        'X-CSRFTOKEN': app.me.csrfToken
      }
    // note, the xhr callback also has a third 'body' argument
    }, (err, resp) => {
      if (err || resp.statusCode >= 400) {
        // for now, log the error in the console & do nothing in the UI
        console && console.error(err); // eslint-disable-line no-console
      } else {
        window.location.reload();
      }
    });
  }
});

