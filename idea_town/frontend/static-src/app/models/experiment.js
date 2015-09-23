import Model from 'ampersand-model';

export default Model.extend({
  urlRoot: '/api/experiments',
  extraProperties: 'allow',

  // This shouldn't be necessary; see comments in collections/experiments.js
  ajaxConfig: { headers: { 'Accept': 'application/json' }}
});
