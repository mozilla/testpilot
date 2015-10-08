import app from 'ampersand-app';

import PageView from './page-view';
import template from '../templates/experiment-page';

export default PageView.extend({
  _template: template,

  headerScroll: true,

  events: {
    'click [data-hook=install]': 'install',
    'click [data-hook=uninstall]': 'uninstall'
  },

  initialize(opts) {
    this.model = app.experiments.get(opts.slug, 'slug');
  },

  render() {
    this.title = this.model.title;
    this.isInstalled = !!this.model.isInstalled;
    this.details = this.model.details;
    this.thumbnail = this.model.thumbnail;
    this.description = this.model.description;

    // TODO: let's not mess with body, if possible
    if (this.isInstalled) {
      document.body.classList.add('active');
    } else {
      document.body.classList.add('inactive');
    }
    document.body._id = document.body.id;
    document.body.id = 'idea-view';

    PageView.prototype.render.apply(this, arguments);
  },

  remove() {
    document.body.id = document.body._id;
    document.body.classList.remove('active');
    document.body.classList.remove('inactive');

    PageView.prototype.remove.apply(this, arguments);
  },

  // isInstall is a boolean: true if we are installing, false if uninstalling
  _updateAddon(isInstall) {
    this.model.isInstalled = !this.model.isInstalled;
    const packet = isInstall ? { install: this.model.slug } :
                  { uninstall: this.model.slug };
    app.webChannel.sendMessage('from-web-to-addon', packet);
    this.render();
  },

  install(evt) {
    evt.preventDefault();
    this._updateAddon(true);
  },

  uninstall(evt) {
    evt.preventDefault();
    this._updateAddon(false);
  }
});
