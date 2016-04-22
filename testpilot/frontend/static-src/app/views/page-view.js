import BaseView from './base-view';
import HeaderView from './header-view';
import FooterView from './footer-view';

export default BaseView.extend({
  pageTitle: 'Firefox Test Pilot',
  pageTitleL10nID: 'pageTitleDefault',

  afterRender() {
    window.scrollTo(0, 0);
    this.renderSubview(new HeaderView({
      headerScroll: this.headerScroll
    }), '[data-hook="header-view"]');

    this.renderSubview(new FooterView(), '[data-hook="footer-view"]');
  }
});
