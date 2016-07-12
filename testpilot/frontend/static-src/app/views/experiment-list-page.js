import app from 'ampersand-app';
import ExperimentListView from './experiment-list-view';
import PageView from './page-view';

import template from '../templates/experiment-list-page';

export default PageView.extend({
  pageTitle: 'Firefox Test Pilot',
  pageTitleL10nID: 'pageTitleExperimentListPage',
  template: template,

  render() {
    this.hasAddon = app.me.hasAddon;
    PageView.prototype.render.apply(this, arguments);
    this.renderSubview(new ExperimentListView({hasAddon: this.hasAddon}),
      '[data-hook="experiment-list"]');

    app.sendToGA('pageview', {
      'dimension1': this.hasAddon
    });
  },

  remove() {
    PageView.prototype.remove.apply(this, arguments);
  }
});
