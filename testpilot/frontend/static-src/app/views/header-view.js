import app from 'ampersand-app';
import BaseView from './base-view';
import SettingsMenuView from './settings-menu-view';

import template from '../templates/header-view';

export default BaseView.extend({
  template: template,

  props: {
    title: {type: 'string', default: 'Firefox Test Pilot'},
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

  initialize(opts) {
    if (opts.headerScroll) {
      const chunkedUrl = location.pathname.split('/');
      if (chunkedUrl.length < 2) {
        return;
      }

      this.experiment = app.experiments.get(chunkedUrl[2], 'slug').toJSON();
    }

    // addon changes may be broadcast by the testpilot addon outside the
    // regular page load cycle, and those changes alter the header's
    // appearance
    app.me.on('change:hasAddon', this.render, this);
    BaseView.prototype.initialize.apply(this, arguments);
  },

  beforeRender() {
    // an active user has an addon
    this.activeUser = app.me.hasAddon;

    if (this.experiment) {
      this.isInstalled = !!this.experiment.isInstalled;
    }
  },

  afterRender() {
    this.renderSubview(new SettingsMenuView({
    }), '[data-hook=install]');
  }
});
