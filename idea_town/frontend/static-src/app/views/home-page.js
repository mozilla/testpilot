import app from 'ampersand-app';
import ExperimentRowView from './experiment-row-view';

import BaseView from './base-view';

export default BaseView.extend({
  _template: `<section class="page"><ul class="experiments"></ul></section>`,

  render() {
    // TODO: do I need to do this if I don't want to manually assign this.el?
    BaseView.prototype.render.apply(this, arguments);

    // render the experiment list into the page
    this.experimentList = this.renderCollection(
      app.experiments,
      ExperimentRowView,
      this.query('.experiments')
    );
  }

});
