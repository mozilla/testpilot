import app from 'ampersand-app';

import BaseView from './base-view';
import template from '../templates/experiment-row-view';

export default BaseView.extend({
  _template: template,

  events: {
    'click [data-hook=show-detail]': 'openDetailPage'
  },

  initialize() {
    this.model.on('change:enabled', this.renderButton, this);
    this.title = this.model.title;
    this.description = this.model.description;
    this.thumbnail = this.model.thumbnail;
    this.enabled = this.model.enabled;
  },

  openDetailPage(evt) {
    evt.preventDefault();
    app.router.navigate('experiments/' + this.model.slug);
  }
});
