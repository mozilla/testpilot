import app from 'ampersand-app';

import BaseView from './base-view';

export default BaseView.extend({
  _template: `<li data-hook="show-detail"
                  // toggle a class for styling purposes:
                  class="{{#isInstalled}} active {{/isInstalled}}">
                <img width="200" height="200" src="{{thumbnail}}">
                <h2>{{title}}</h2>
                <p>Status: {{^isInstalled}} Not {{/isInstalled}} Installed</p>
              </li>`,

  events: {
    'click [data-hook=show-detail]': 'openDetailPage'
  },

  initialize() {
    this.model.on('change:isInstalled', this.renderButton, this);

    this.title = this.model.title;
    this.thumbnail = this.model.thumbnail;
    this.isInstalled = this.model.isInstalled;
  },

  openDetailPage(evt) {
    evt.preventDefault();
    app.router.navigate('experiments/' + this.model.slug);
  }
});
