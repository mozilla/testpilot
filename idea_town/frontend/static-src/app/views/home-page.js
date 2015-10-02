import app from 'ampersand-app';
import ExperimentRowView from './experiment-row-view';

import BaseView from './base-view';
import template from '../templates/home-page';

export default BaseView.extend({
  _template: template,

  render() {
    // TODO: this is not awesome
    document.body.id = document.body._id;
    document.body.id = 'list-view';

    BaseView.prototype.render.apply(this, arguments);

    // render the experiment list into the page
    this.experimentList = this.renderCollection(
      app.experiments,
      ExperimentRowView,
      this.query('.experiments')
    );
  },

  remove() {
    document.body.id = document.body._id;

    BaseView.prototype.remove.apply(this, arguments);
  }

});
