import app from 'ampersand-app';
import dom from 'ampersand-dom';

import BaseView from './base-view';

// we have to drive the user to the detail page to view terms / privacy info before installing
// calling the button 'install' is a bit of a misnomer, we might just want a > instead of a button
export default BaseView.extend({
  _template: `<li>Experiment name: <a class="name"></a> <button data-hook="show-detail">Install</button></li>`,

  events: {
    'click [data-hook=show-detail]': 'openDetailPage'
  },

  initialize() {
    this.model.on('change:isInstalled', this.renderButton, this);
  },

  render() {
    BaseView.prototype.render.apply(this, arguments);

    dom.text(this.el.querySelector('.name'), this.model.name);

    this.button = this.el.querySelector('button');
    this.renderButton();
  },

  renderButton() {
    if (this.model.isInstalled) {
      dom.text(this.button, 'Uninstall');
    } else {
      dom.text(this.button, 'Install');
    }
  },

  openDetailPage(evt) {
    evt.preventDefault();
    app.router.navigate('experiments/' + this.model.name);
  }
});
