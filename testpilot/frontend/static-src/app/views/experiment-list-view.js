import app from 'ampersand-app';
import BaseView from './base-view';
import ExperimentRowView from './experiment-row-view';


export default BaseView.extend({
  template: `<div id="experiment-list" class="experiments"></div>`,

  props: {
    loggedIn: 'boolean'
  },

  render() {
    BaseView.prototype.render.apply(this, arguments);
    this.experimentList = this.renderCollection(
      app.experiments,
      ExperimentRowView,
      this.query('.experiments'), {
        viewOptions: {
          loggedIn: this.loggedIn
        }
      }
    );
  },

  remove() {
    BaseView.prototype.remove.apply(this, arguments);
  }
});
