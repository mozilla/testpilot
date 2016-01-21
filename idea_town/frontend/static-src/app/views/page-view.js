import BaseView from './base-view';
import HeaderView from './header-view';
import FooterView from './footer-view';

export default BaseView.extend({
  pageTitle: 'Idea Town',
  pageTitleL10nID: 'pageTitleDefault',

  afterRender() {
    this.renderSubview(new HeaderView({
      headerScroll: this.headerScroll
    }), '[data-hook="main-header"]');

    this.renderSubview(new FooterView(), '[data-hook="main-footer"]');
  }
});
