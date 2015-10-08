import BaseView from './base-view';
import HeaderView from './header-view';

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
    }
  }
});
