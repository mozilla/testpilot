import app from 'ampersand-app';
import Model from 'ampersand-model';
import Collection from 'ampersand-collection';

import PageView from './page-view';
import DetailView from './detail-view';
import ContributorView from './contributor-view';
import template from '../templates/experiment-page';
import FeedbackView from './feedback-view';
const changeHeaderOn = 74;

const CollectionExtended = Collection.extend({
  model: Model.extend({
    extraProperties: 'allow'
  })
});

export default PageView.extend({
  template: template,

  headerScroll: true,

  events: {
    'click [data-hook=install]': 'install',
    'click [data-hook=uninstall]': 'uninstall',
    'click [data-hook=feedback]': 'feedback'
  },

  bindings: {

    'model.title': {
      type: 'text',
      hook: 'title'
    },

    'model.enabled': [{
      type: 'toggle',
      yes: '[data-hook=uninstall]',
      no: '[data-hook=install]'
    },
    {
      type: 'toggle',
      hook: 'feedback'
    }],

    'model.modified_date': {
      type: (el, value) => new Date(value),
      hook: 'modified-date'
    },

    'model.description': {
      hook: 'modified-date'
    },

    'model.contribute_url': [{
      hook: 'contribute-url'
    },
    {
      type: 'attribute',
      name: 'href',
      hook: 'contribute-url'
    }],

    'model.measurements': [{
      type: 'innerHTML',
      hook: 'measurements-html'
    },
    {
      type: 'toggle',
      hook: 'measurements-container'
    }],

    'model.changelog_url': {
      type: 'attribute',
      name: 'href',
      hook: 'changelog-url'
    },

    'model.thumbnail': {
      type: 'attribute',
      name: 'src',
      hook: 'thumbnail'
    }
  },

  initialize(opts) {
    this.model = app.experiments.get(opts.slug, 'slug');

    this.didScroll = false;

    window.addEventListener('scroll', function scrollListener() {
      if (!this.didScroll) {
        this.didScroll = true;
        setTimeout(this.onScroll.bind(this), 200);
      }
    }.bind(this));
  },

  render() {
    // TODO: let's not mess with body, if possible
    document.body._id = document.body.id;
    document.body.id = 'idea-view';

    PageView.prototype.render.apply(this, arguments);

    return this;
  },

  afterRender() {
    this.renderCollection(new CollectionExtended(this.model.details),
                          DetailView,
                          this.query('.details-description'));

    this.renderCollection(new CollectionExtended(this.model.contributors),
                          ContributorView,
                          this.query('.contributors'));

    PageView.prototype.afterRender.apply(this, arguments);
  },

  remove() {
    document.body.id = document.body._id;
    PageView.prototype.remove.apply(this, arguments);
  },

  // isInstall is a boolean: true if we are installing, false if uninstalling
  _updateAddon(isInstall) {
    let eventType = 'install-experiment';

    if (!isInstall) {
      eventType = 'uninstall-experiment';
    }

    app.webChannel.sendMessage(eventType, {
      addon_id: this.model.addon_id,
      xpi_url: this.model.xpi_url
    });

    // TODO:(DJ) need to setup some databinding and progress ui Since
    // the addon can fail on install.
    // https://github.com/mozilla/idea-town/issues/199
    this.model.enabled = !this.model.enabled;
  },

  install(evt) {
    evt.preventDefault();
    this._updateAddon(true);
  },

  uninstall(evt) {
    evt.preventDefault();
    this._updateAddon(false);
    // TODO: Hardcoded survey, for now. Populate via API later?
    this.renderSubview(new FeedbackView({
      id: 'disabled-feedback',
      experiment: this.model.url,
      title: 'Why are you stopping?',
      questions: [
        { value: 'broken', title: 'This thing is broken!' },
        { value: 'dislike', title: 'I don\'t like this feature.' },
        { value: 'notuseful', title: 'This isn\'t useful for me.' },
        { value: 'other', title: 'Something else.' }
      ]
    }), 'body');
  },

  onScroll() {
    const sy = window.pageYOffset || document.documentElement.scrollTop;

    if (sy > changeHeaderOn) {
      this.query('.details-header-wrapper').classList.add('stick');
      this.query('#details').style.marginTop = '74px';
    } else {
      this.query('#details').style.marginTop = '0';
      this.query('.details-header-wrapper').classList.remove('stick');
    }

    this.didScroll = false;
  },

  feedback(evt) {
    evt.preventDefault();
    // TODO: Hardcoded survey, for now. Populate via API later?
    this.renderSubview(new FeedbackView({
      id: 'enabled-feedback',
      experiment: this.model.url,
      title: 'Tell us what you think',
      questions: [
        { value: 'broken', title: 'Something seems broken.' },
        { value: 'feature', title: 'Request a feature.' },
        { value: 'cool', title: 'This is cool!' },
        { value: 'other', title: 'Something else.' }
      ]
    }), 'body');
  }
});
