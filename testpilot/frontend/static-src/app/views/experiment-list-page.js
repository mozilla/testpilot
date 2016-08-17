import app from 'ampersand-app';
import cookies from 'js-cookie';
import ExperimentListView from './experiment-list-view';
import EmailDialogView from './email-opt-in-dialog-view';
import PageView from './page-view';

import template from '../templates/experiment-list-page';

export default PageView.extend({
  pageTitle: 'Firefox Test Pilot',
  pageTitleL10nID: 'pageTitleExperimentListPage',
  template: template,

  render() {
    this.hasAddon = app.me.hasAddon;
    PageView.prototype.render.apply(this, arguments);
    this.renderSubview(new ExperimentListView({
      hasAddon: this.hasAddon,
      eventCategory: 'ExperimentsPage Interactions'
    }), '[data-hook="experiment-list"]');

    if (cookies.get('first-run')) {
      cookies.remove('first-run');
      this.renderSubview(new EmailDialogView({}), 'body');
    }

    app.sendToGA('pageview', {
      'dimension1': this.hasAddon
    });
  },

  remove() {
    PageView.prototype.remove.apply(this, arguments);
  }
});
