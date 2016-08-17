import app from 'ampersand-app';
import BaseView from './base-view';
import ExperimentRowView from './experiment-row-view';
import ExperimentsCollection from '../collections/experiments';

export default BaseView.extend({
  template: `<div class="card-list experiments"></div>`,

  props: {
    hasAddon: 'boolean',
    except: { type: 'string', required: false },
    eventCategory: 'string'
  },

  render() {
    BaseView.prototype.render.apply(this, arguments);

    const filteredExperiments = () => {
      if (this.except) {
        const filtered = app.experiments.models.filter(experiment => {
          return experiment.slug !== this.except;
        });
        return new ExperimentsCollection(filtered);
      }
      return app.experiments;
    }();

    this.experimentList = this.renderCollection(
      filteredExperiments,
      ExperimentRowView,
      this.query('.experiments'), {
        viewOptions: {
          hasAddon: this.hasAddon,
          eventCategory: this.eventCategory
        }
      }
    );
  },

  remove() {
    BaseView.prototype.remove.apply(this, arguments);
  }
});
