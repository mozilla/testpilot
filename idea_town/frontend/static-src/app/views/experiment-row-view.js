import app from 'ampersand-app';

import BaseView from './base-view';
import template from '../templates/experiment-row-view';

export default BaseView.extend({
  _template: template,

  events: {
    'click [data-hook=show-detail]': 'openDetailPage'
  },

  initialize() {
    this.model.on('change:isInstalled', this.renderButton, this);

    this.title = this.model.title;
    this.thumbnail = this.model.thumbnail;
    this.isInstalled = this.model.isInstalled;
  },

  openDetailPage(evt) {
    evt.preventDefault();
    app.router.navigate('experiments/' + this.model.slug);
  }
});
