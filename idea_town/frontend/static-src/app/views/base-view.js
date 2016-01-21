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

    this.localizeRendered();
    if (this.model) {
      this.model.on('change', () => this.localizeRendered);
    }
  },

  getL10nArgs() {
    // Most common case for l10n args comes from the current model - e.g. on
    // experiment detail page.
    return this.model ? this.model.toJSON() : {};
  },

  localizeRendered() {
    const args = this.getL10nArgs();
    const argsJSON = JSON.stringify(args);

    // HACK: Slap the same data-l10n-args data on every localized node, because
    // the most common case is they all need the same model data.
    const nodes = this.queryAll('[data-l10n-id]');
    for (const node of nodes) {
      node.setAttribute('data-l10n-args', argsJSON);
    }
  },

  // implement in subclasses
  beforeRender() {},
  afterRender() {}
});
