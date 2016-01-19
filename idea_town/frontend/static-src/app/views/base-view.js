import AmpersandView from 'ampersand-view';
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
  afterRender() {}
});
