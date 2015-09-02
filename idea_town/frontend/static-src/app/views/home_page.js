import View from 'ampersand-view';
import mustache from 'mustache';
import ExperimentRowView from './experiment_row_view';

export default View.extend({
  template: mustache.render('<section class="page"><ul class="experiments"></ul></section>'),

  initialize(opts) {
    if (opts && opts.experiments) {
      this.experiments = opts.experiments;
    }
  },

  // needs opts.experiments to be a collection of experiments
  render(opts) {
    // TODO: do I need to do this if I don't want to manually assign this.el?
    View.prototype.render.apply(this, arguments);

    if (opts && opts.experiments) {
      this.experiments = opts.experiments;
    }

    // render the experiment list into the page
    this.experimentList = this.renderCollection(
      this.experiments,
      ExperimentRowView,
      this.el.querySelector('.experiments'),
      opts);
  },

  // TODO: move into a base view?
  remove() {
    const parent = this.el.parentNode;
    if (parent) parent.removeChild(this.el);
  }

});
