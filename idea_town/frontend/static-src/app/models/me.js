import State from 'ampersand-state';
import cookies from 'js-cookie';

// Abstract away the underlying django cookies by making them
// observable, derived properties.
// TODO: session cookies aren't visible to JS by default; switch to
//       some kind of session-check API that sends over the user model
//       (email, name, avatar) if the user's logged in.
export default State.extend({
  derived: {
    csrfToken: {
      cache: false,
      fn: () => { return cookies.get('csrftoken'); }
    },
    session: {
      cache: false,
      fn: () => { return window.sadface.userId; }
    }
  }
});
