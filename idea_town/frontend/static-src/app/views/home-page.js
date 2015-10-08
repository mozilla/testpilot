import app from 'ampersand-app';
import ExperimentRowView from './experiment-row-view';

import PageView from './page-view';
import template from '../templates/home-page';

export default PageView.extend({
  _template: template,

  render() {
    // TODO: this is not awesome
    document.body.id = document.body._id;
    document.body.id = 'list-view';

    PageView.prototype.render.apply(this, arguments);

    // render the experiment list into the page
    this.experimentList = this.renderCollection(
      app.experiments,
      ExperimentRowView,
      this.query('.experiments')
    );
  },

  remove() {
    document.body.id = document.body._id;

    PageView.prototype.remove.apply(this, arguments);
  }

});
