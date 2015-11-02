import BaseView from './base-view';
import HeaderView from './header-view';
import FooterView from './footer-view';

export default BaseView.extend({
  // override _template with a mustache template
  subviews: {
    header: {
      selector: '[data-hook=main-header]',
      prepareView: function prepHeaderView(el) {
        return new HeaderView({
          el: el,
          headerScroll: this.headerScroll
        });
      }
    },
    footer: {
      selector: '[data-hook=main-footer]',
      prepareView: function prepareFooterView(el) {
        return new FooterView({
          el: el
        });
      }
    }
  }
});
