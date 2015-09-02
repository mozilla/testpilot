import View from 'ampersand-view';
import dom from 'ampersand-dom';
import mustache from 'mustache';
import webChannel from '../lib/web_channel';

export default View.extend({
  template: mustache.render(`<section class="page" data-hook="experiment-page">
               <h1 data-hook="displayName"></h1>
               <button data-hook="install">Install</button>
             </section>`),

  events: {
    'click [data-hook=install]': 'install',
    'click [data-hook=uninstall]': 'uninstall'
  },

  initialize(opts) {
    if (opts && opts.experiment) {
      this.model = opts.experiment;
    }
  },

  render(opts) {
    View.prototype.render.apply(this, arguments);
    this.renderWithTemplate(this);

    if (opts && opts.experiment) {
      this.model = opts.experiment;
    }
    this.heading = this.el.querySelector('[data-hook=displayName]');
    dom.text(this.heading, this.model.displayName);

    this.button = this.el.querySelector('button');
    this.renderButton();
  },

  // TODO: move into a base view?
  remove() {
    const parent = this.el.parentNode;
    if (parent) parent.removeChild(this.el);
  },

  renderButton() {
    if (this.model.isInstalled) {
      dom.setAttribute(this.button, 'data-hook', 'uninstall');
      dom.text(this.button, 'Uninstall');
    } else {
      dom.setAttribute(this.button, 'data-hook', 'install');
      dom.text(this.button, 'Install');
    }
  },

  // isInstall is a boolean: true if we are installing, false if uninstalling
  _updateAddon(isInstall) {
    this.model.isInstalled = !this.model.isInstalled;
    const packet = isInstall ? { install: this.model.name } :
                  { uninstall: this.model.name };
    webChannel.sendMessage('from-web-to-addon', packet);
    // TODO: have to delay updates, or the event delegation code will call
    //       the other data-hook handler in the same turn (without yielding
    //       to the UI thread). This seems like a bug in ampersand-view:
    //       it seems to run through all of the install handlers, then re-check
    //       the DOM for uninstall handlers, even though the click occurred
    //       before the uninstall handlers hit the page.
    setTimeout(() => this.renderButton());
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
