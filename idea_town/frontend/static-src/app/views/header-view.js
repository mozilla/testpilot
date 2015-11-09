import app from 'ampersand-app';
import BaseView from './base-view';

import template from '../templates/header-view';
import scrollTemplate from '../templates/scroll-header-view';
const changeHeaderOn = 100;

export default BaseView.extend({
  template: template,

  props: {
    avatar: 'string',
    scrolled: {type: 'boolean', default: false},
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
    },
    'scrolled': [{
      type: 'toggle',
      yes: '[data-hook=scroll]',
      no: '[data-hook=no-scroll]'
    }, {
      type: 'booleanClass',
      hook: 'scroll-wrap',
      name: 'detail-header'
    }],
    'avatar': [{
      type: 'attribute',
      name: 'src',
      selector: '.avatar'
    }, {
      type: 'toggle',
      yes: '.avatar',
      no: '.default-avatar'
    }]
  },

  events: {
    'click [data-hook=logout]': 'logout'
  },

  initialize(opts) {
    if (opts.headerScroll) {
      const chunkedUrl = location.pathname.split('/');
      if (chunkedUrl.length < 2) {
        return;
      }

      this.template = scrollTemplate;
      this.experiment = app.experiments.get(chunkedUrl[2], 'slug').toJSON();
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
    BaseView.prototype.initialize.apply(this, arguments);
  },

  beforeRender() {
    this.session = app.me.user.id;

    // an active user has an addon and a session
    this.activeUser = !!this.session && app.me.hasAddon;

    if (!!this.session && app.me.user.profile.avatar) {
      this.avatar = app.me.user.profile.avatar;
    }

    if (this.experiment) {
      this.title = this.experiment.title;
      this.isInstalled = !!this.experiment.isInstalled;
    }
  },

  onScroll() {
    const sy = window.pageYOffset || document.documentElement.scrollTop;
    if (sy >= changeHeaderOn) {
      this.model.scrolled = true;
    } else {
      this.model.scrolled = false;
    }
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
