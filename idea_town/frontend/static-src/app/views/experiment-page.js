import app from 'ampersand-app';
import Model from 'ampersand-model';
import Collection from 'ampersand-collection';

import PageView from './page-view';
import DetailView from './detail-view';
import ContributorView from './contributor-view';
import template from '../templates/experiment-page';
import FeedbackView from './feedback-view';
const changeHeaderOn = 120;

const CollectionExtended = Collection.extend({
  model: Model.extend({
    extraProperties: 'allow'
  })
});

export default PageView.extend({
  template: template,

  headerScroll: true,

  events: {
    'click #install-button': 'install',
    'click #uninstall-button': 'renderUninstallSurvey',
    'click #feedback-button': 'feedback'
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

    'model.modified': {
      type: (el, value) => {
        const d = new Date(value);

        // check for invalid date
        if (isNaN(d)) {
          el.style.display = 'none';
          return;
        }

        let formatted = '';

        // safari is the new IE :(
        try {
          formatted = d.toLocaleDateString();
        } catch (e) {
          formatted = `${d.getMonth() + 1} / ${d.getDate()} / ${d.getFullYear()}`;
        }

        el.innerHTML = formatted;
      },
      hook: 'modified-date'
    },

    'model.version': {
      hook: 'version'
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

    'model.changelog_url': [{
      type: 'toggle',
      hook: 'changelog-url',
      mode: 'visibility'
    },
    {
      type: 'attribute',
      name: 'href',
      hook: 'changelog-url'
    }],

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
        setTimeout(this.onScroll.bind(this), 50);
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
  updateAddon(isInstall, model) {
    let eventType = 'install-experiment';

    if (!isInstall) {
      eventType = 'uninstall-experiment';
    }

    app.webChannel.sendMessage(eventType, {
      addon_id: model.addon_id,
      xpi_url: model.xpi_url
    });

    // TODO:(DJ) need to setup some databinding and progress ui Since
    // the addon can fail on install.
    // https://github.com/mozilla/idea-town/issues/199
    model.enabled = !model.enabled;
  },

  install(evt) {
    evt.preventDefault();
    const width = evt.target.offsetWidth;
    evt.target.style.width = width + 'px';
    evt.target.classList.add('state-change');
    setTimeout(() => {
      evt.target.classList.remove('state-change');
      this.updateAddon(true, this.model);
    }, 2000);
  },

  uninstall(callback, model) {
    const uninstallButton = document.getElementById('uninstall-button');
    const feedbackButton = document.getElementById('feedback-button');
    const width = uninstallButton.offsetWidth;
    uninstallButton.style.width = width + 'px';
    uninstallButton.classList.add('state-change');
    feedbackButton.style.display = 'none';
    setTimeout(() => {
      uninstallButton.classList.remove('state-change');
      feedbackButton.style.display = 'initial';
      callback(false, model);
    }, 2000);
  },

  renderUninstallSurvey(evt) {
    evt.preventDefault();
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
      ],
      uninstall: this.uninstall,
      updateAddon: this.updateAddon,
      model: this.model
    }), 'body');
  },

  onScroll() {
    const sy = window.pageYOffset || document.documentElement.scrollTop;

    if (sy > changeHeaderOn) {
      this.query('.details-header-wrapper').classList.add('stick');
    } else {
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
