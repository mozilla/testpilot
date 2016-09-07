import BaseView from './base-view';
import HeaderView from './header-view';
import FooterView from './footer-view';

export default BaseView.extend({
  pageTitle: 'Firefox Test Pilot',
  pageTitleL10nID: 'pageTitleDefault',

  afterRender() {
    window.scrollTo(0, 0);

    // skip header rendering on the landing page
    // because we don't need it
    if (!this.skipHeader) {
      this.renderSubview(new HeaderView({
        headerScroll: this.headerScroll
      }), '[data-hook="header-view"]');
    }

    this.renderSubview(new FooterView(), '[data-hook="footer-view"]');
  }
});
