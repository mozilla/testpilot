import app from 'ampersand-app';

import BaseView from './base-view';

export default BaseView.extend({
  _template: `<section class="page" data-hook="experiment-page">
               <h1>{{title}}</h1>
               {{#isInstalled}}
                <button data-hook="uninstall">Uninstall</button>
               {{/isInstalled}}
               {{^isInstalled}}
                 <button data-hook="install">Install</button>
               {{/isInstalled}}
             </section>`,

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
    BaseView.prototype.render.apply(this, arguments);
  },

  // isInstall is a boolean: true if we are installing, false if uninstalling
  _updateAddon(isInstall) {
    this.model.isInstalled = !this.model.isInstalled;
    const packet = isInstall ? { install: this.model.name } :
                  { uninstall: this.model.name };
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
