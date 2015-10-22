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
    this.modified_date = new Date(this.model.modified);
    this.created_date = new Date(this.model.created);

    // TODO: let's not mess with body, if possible

    // TODO:(DJ) enabled property is not set here when navigating
    // directly to the experiment page. This will not be a problem
    // when we start persisting state with the User Installation model.
    if (this.model.enabled) {
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
    let eventType = 'install-experiment';

    if (!isInstall) {
      eventType = 'uninstall-experiment';
    }

    app.webChannel.sendMessage(eventType, {
      addon_id: this.model.addon_id,
      xpi_url: this.model.xpi_url
    });
    // TODO:(DJ) need to setup some databinding and progress ui Since
    // the addon can fail on install.
    this.model.enabled = !this.model.enabled;
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
