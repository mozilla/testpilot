import app from 'ampersand-app';
import BaseView from './base-view';
import SettingsMenuView from './settings-menu-view';

import template from '../templates/header-view';
import scrollTemplate from '../templates/scroll-header-view';

export default BaseView.extend({
  template: template,

  subviews: {
    'settings-menu': {
      hook: 'settings',
      constructor: SettingsMenuView
    }
  },

  props: {
    title: {type: 'string', default: 'Idea Town'},
    isInstalled: {type: 'boolean', default: false},
    activeUser: {type: 'boolean', required: true, default: false}
  },

  bindings: {
    'title': '[data-hook=title]',
    'activeUser': {
      type: 'toggle',
      yes: '[data-hook=active-user]',
      no: '[data-hook=inactive-user]'
    },
    'isInstalled': {
      type: 'toggle',
      yes: '[data-hook=uninstall]',
      no: '[data-hook=install]'
    }
  },

  events: {
    'click [data-hook=logout]': 'logout'
  },

  initialize(opts) {
    // this.model = new HeaderModel();
    if (opts.headerScroll) {
      const chunkedUrl = location.pathname.split('/');
      if (chunkedUrl.length < 2) {
        return;
      }
      this.template = scrollTemplate;
      this.experiment = app.experiments.get(chunkedUrl[2], 'slug').toJSON();
    }

    // addon changes may be broadcast by the idea-town addon outside the
    // regular page load cycle, and those changes alter the header's
    // appearance
    app.me.on('change:hasAddon', this.render, this);
    BaseView.prototype.initialize.apply(this, arguments);
  },

  beforeRender() {
    this.session = app.me.user.id;

    // an active user has an addon and a session
    this.activeUser = !!this.session && app.me.hasAddon;

    if (this.experiment) {
      this.title = this.experiment.title;
      this.isInstalled = !!this.experiment.isInstalled;
    }
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
