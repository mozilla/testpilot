import app from 'ampersand-app';
import Collection from 'ampersand-rest-collection';

import Experiment from '../models/experiment';

export default Collection.extend({
  model: Experiment,
  indexes: ['slug'],
  url: '/api/experiments',
  comparator: 'order',

  initialize() {
    app.on('webChannel:addon-self:uninstalled', () => {
      this.models.forEach(m => m.enabled = false);
    });
  },

  fetch(optionsIn) {
    return new Promise((resolve, reject) => {
      const options = optionsIn || {};
      options.success = resolve;
      options.error = reject;
      Collection.prototype.fetch.call(this, options);
    });
  },

  // django-rest-framework returns the actual models under 'results'
  parse(response) {
    return response.results;
  }
});
