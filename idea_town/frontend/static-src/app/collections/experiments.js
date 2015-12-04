import app from 'ampersand-app';
import Collection from 'ampersand-rest-collection';
import includes from 'lodash/collection/includes';

import Experiment from '../models/experiment';

export default Collection.extend({
  model: Experiment,
  indexes: ['slug'],
  url: '/api/experiments',

  // Ampersand.sync doesn't seem to pass correct Accept headers by default.
  // This supposedly is fixed by https://github.com/AmpersandJS/ampersand-sync/pull/24
  // but still seems busted. Maybe the deps of the dependents haven't been
  // updated yet? TODO: investigate
  ajaxConfig: { headers: { 'Accept': 'application/json' }},

  initialize() {
    // TODO:(DJ) This is not being run on the experiment-page.
    // We need to persist this data through the User Installation model.
    app.on('webChannel:addon-available', addons => {
      const ids = addons.installed.map(a => a.id);
      this.models.forEach(m => m.enabled = includes(ids, m.addon_id));
    });

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
