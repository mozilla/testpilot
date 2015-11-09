import Model from 'ampersand-model';
import Collection from 'ampersand-collection';
import CollectionRenderer from 'ampersand-collection-view';

import BaseView from './base-view';
import template from '../templates/details-view';
import ContributorView from './contributor-view';

const Contributors = Collection.extend({
  model: Model.extend({
    extraProperties: 'allow'
  })
});

export default BaseView.extend({
  _template: template,

  bindings: {
    'model.modified_date': {
      type: (el, value) => new Date(value),
      hook: 'modified-date'
    },

    'model.description': {
      hook: 'modified-date'
    },

    'model.contribute_url': [{
      hook: 'contribute-url'
    },
    {
      type: 'attribute',
      name: 'href',
      hook: 'contribute-url'
    }],

    'model.measurements': [{
      type: 'innerHTML',
      hook: 'measurements-html'
    },
    {
      type: 'toggle',
      hook: 'measurements-container'
    }],

    'model.changelog_url': {
      type: 'attribute',
      name: 'href',
      hook: 'changelog-url'
    },

    'model.thumbnail': {
      type: 'attribute',
      name: 'src',
      hook: 'thumbnail'
    },

    'model.details.image': {
      type: 'attribute',
      name: 'src',
      hook: 'detail-image'
    },

    'model.details.copy': {
      type: 'text',
      hook: 'detail-copy'
    },

    'model.details.headline': {
      hook: 'detail-headline'
    }
  },

  afterRender() {
    new CollectionRenderer({
      el: this.query('.contributors'),
      view: ContributorView,
      collection: new Contributors(this.model.contributors)
    }).render();
  }
});
