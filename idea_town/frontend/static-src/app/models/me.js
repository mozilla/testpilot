import app from 'ampersand-app';
import cookies from 'js-cookie';
import State from 'ampersand-state';

// Abstract away the underlying django cookies by making them
// observable, derived properties.
// TODO: session cookies aren't visible to JS by default; switch to
//       some kind of session-check API that sends over the user model
//       (email, name, avatar, addon status) if the user's logged in.
export default State.extend({

  props: {
    user: 'object',
    hasAddon: {type: 'boolean', required: true, default: false}
  },

  derived: {
    csrfToken: {
      cache: false,
      fn: () => { return cookies.get('csrftoken'); }
    }
  },

  initialize() {
    app.on('webChannel:addon-available', () => {
      if (!app.me.hasAddon) app.me.hasAddon = true;
    });

    app.on('webChannel:addon-self:installed', () => {
      if (!app.me.hasAddon) app.me.hasAddon = true;
    });

    app.on('webChannel:addon-self:uninstalled', () => {
      if (app.me.hasAddon) app.me.hasAddon = false;
    });

    this.addonCheck();
  },

  // ping the addon to see if it's installed
  addonCheck() {
    app.webChannel.sendMessage('loaded');
  }
});
