import AmpersandView from 'ampersand-view';
import flatten from 'lodash.flatten';
import invoke from 'lodash.invoke';
import mustache from 'mustache';
// BaseView just abstracts out stuff we seem to use in all the views

export default AmpersandView.extend({
  // override _template with a mustache template
  _template: '',

  template(ctx) {
    return mustache.render(this._template, ctx);
  },

  render() {
    this.beforeRender();
    AmpersandView.prototype.render.apply(this, arguments);
    this.afterRender();
  },

  // implement in subclasses
  beforeRender() {},
  afterRender() {},

  removeSubviews() {
    if (this._subviews) {
      invoke(flatten(this._subviews), 'remove');
    }
  }

});
