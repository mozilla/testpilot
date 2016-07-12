import app from 'ampersand-app';

import BaseView from './base-view';

export default BaseView.extend({
  template: `<div data-hook="show-detail" class="experiment-summary">
                <div class="experiment-actions">
                  <div data-l10n-id="experimentListEnabledTab" data-hook="enabled-tab" class="tab enabled-tab"></div>
                </div>
              <div class="experiment-icon-wrapper" data-hook="bg">
                <div class="experiment-icon" data-hook="thumbnail"></div>
              </div>
              <div class="experiment-information">
                <header>
                  <h3 data-hook="title"></h3>
                </header>
                <p data-hook="description"></p>
                <span class="participant-count" data-l10n-id="participantCount"</span>
              </div>
             </div>`,

  props: {
    hasAddon: {type: 'boolean', default: 'false'}
  },

  bindings: {
    'model': [{
      hook: 'title',
      type: function shortTitleWithFallback(el, model) {
        el.innerHTML = model.short_title || model.title;
      }
    },
    {
      hook: 'bg',
      type: function setGradientBg(el, model) {
        el.setAttribute('style',
          `background-color: ${model.gradient_start};
          background-image: linear-gradient(135deg, ${model.gradient_start}, ${model.gradient_stop}`);
        return el;
      }
    }],
    'model.description': {
      hook: 'description'
    },
    'model.thumbnail': {
      type: function setBgThumb(el, value) {
        el.setAttribute('style', `background-image: url(${value});`);
        return el;
      },
      hook: 'thumbnail'
    },
    'model.enabled': [{
      type: 'booleanClass',
      hook: 'show-detail',
      name: 'enabled'
    },
    {
      type: 'toggle',
      hook: 'enabled-tab'
    }],
    'hasAddon': {
      type: 'booleanClass',
      hook: 'show-detail',
      name: 'has-addon'
    }
  },

  events: {
    'click [data-hook=show-detail].has-addon': 'openDetailPage'
  },

  initialize(opts) {
    this.hasAddon = !!opts.hasAddon;
  },

  openDetailPage(evt) {
    evt.preventDefault();
    app.sendToGA('event', {
      eventCategory: 'ExperimentsPage Interactions',
      eventAction: 'Open detail page',
      eventLabel: this.model.title
    });
    app.router.navigate('experiments/' + this.model.slug);
  }
});
