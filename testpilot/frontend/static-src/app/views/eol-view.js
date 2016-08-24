import BaseView from './base-view';

export default BaseView.extend({
  template: `<div class="eol-block"><div data-hook="ending-soon" data-l10n-id="eolMessage">
<strong>This experiment is ending on <span data-hook="completedDate"></span></strong>.<br/><br/>
After then you will still be able to use <span data-hook="title"></span> but we will no longer be providing updates or support.</div>
</div>`,
  props: {
    completedDate: 'string',
    title: 'string'
  },
  bindings: {
    completedDate: '[data-hook=completedDate]',
    title: '[data-hook=title]'
  },
  getL10nArgs: function() {
    return {
      title: this.title,
      completedDate: this.completedDate
    };
  }
});
