import app from 'ampersand-app';

import BaseView from './base-view';

export default BaseView.extend({
  template: `<div data-hook="show-detail" class="experiment-summary">
              <div class="experiment-icon-wrapper" data-hook="bg">
                <div class="experiment-icon" data-hook="thumbnail"></div>
              </div>
              <div class="experiment-information">
                <header>
                  <h3 data-hook="title"></h3>
                </header>
                <p data-hook="description"></p>
              </div>
               <div class="experiment-actions">
                  <button data-l10n-id="experimentListInactiveHover" class="button default show-when-inactive">Get Started</button>
                  <button data-l10n-id="experimentListActiveHover" class="button secondary show-when-active">Manage</button>
               </div>
             </div>`,

  props: {
    loggedIn: {type: 'boolean', default: 'false'}
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
    'model.enabled': {
      type: 'booleanClass',
      hook: 'show-detail',
      name: 'active'
    },
    'loggedIn': {
      type: 'booleanClass',
      hook: 'show-detail',
      name: 'logged-in'
    }
  },

  events: {
    'click [data-hook=show-detail].logged-in': 'openDetailPage'
  },

  initialize(opts) {
    this.loggedIn = opts.loggedIn;
  },

  openDetailPage(evt) {
    evt.preventDefault();
    if (this.model.enabled) {
      app.sendToGA('event', {
        eventCategory: 'ExperimentsPage Interactions',
        eventAction: 'Manage experiment button',
        eventLabel: this.model.title
      });
    } else {
      app.sendToGA('event', {
        eventCategory: 'ExperimentsPage Interactions',
        eventAction: 'Get Started experiment button',
        eventLabel: this.model.title
      });
    }
    app.router.navigate('experiments/' + this.model.slug);
  }
});
