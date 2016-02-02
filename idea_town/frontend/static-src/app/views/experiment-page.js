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
    'click [data-hook=install]': 'install',
    'click [data-hook=uninstall]': 'renderUninstallSurvey',
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
    },
    {
      type: 'toggle',
      hook: 'now-active'
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

    'model.installation_count': {
      hook: 'install-count'
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

    'model.privacy_notice_url': [{
      type: 'toggle',
      hook: 'privacy-notice-url',
      mode: 'visibility'
    },
    {
      type: 'attribute',
      name: 'href',
      hook: 'privacy-notice-url'
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

    this.pageTitle = 'Idea Town - ' + this.model.title;
    this.pageTitleL10nID = 'pageTitleExperiment';
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
  },

  install(evt) {
    evt.preventDefault();
    const width = evt.target.offsetWidth;
    evt.target.style.width = width + 'px';
    evt.target.classList.add('state-change');

    // TODO: Should this maybe be an event listener at a global level?
    app.once('webChannel:addon-install:install-ended', () => {
      this.model.enabled = true;
      evt.target.classList.remove('state-change');
      this.model.set('installation_count', this.model.installation_count + 1);
      this.model.fetch();
    });
    this.updateAddon(true, this.model);
  },

  uninstall(evt) {
    evt.preventDefault();
    const width = evt.target.offsetWidth;
    evt.target.style.width = width + 'px';
    evt.target.classList.add('state-change');

    // TODO: Should this maybe be an event listener at a global level?
    app.once('webChannel:addon-uninstall:uninstall-ended', () => {
      this.model.enabled = false;
      evt.target.classList.remove('state-change');
      if (this.model.installation_count > 0) {
        this.model.set('installation_count', this.model.installation_count - 1);
      }
      this.model.fetch();
    });
    this.updateAddon(false, this.model);
  },

  renderUninstallSurvey(evt) {
    evt.preventDefault();
    this.renderSubview(new FeedbackView({
      id: 'disabled-feedback',
      experiment: this.model.url,
      title: 'feedbackUninstallTitle',
      questions: [
        { value: 'broken', title: 'feedbackUninstallAnswerBroken' },
        { value: 'dislike', title: 'feedbackUninstallAnswerDislike' },
        { value: 'notuseful', title: 'feedbackUninstallAnswerNotUseful' },
        { value: 'other', title: 'feedbackUninstallAnswerOther' }
      ],
      onSubmit: () => this.uninstall(evt)
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
    this.renderSubview(new FeedbackView({
      id: 'enabled-feedback',
      experiment: this.model.url,
      title: 'feedbackTitle',
      questions: [
        { value: 'broken', title: 'feedbackAnswerBroken' },
        { value: 'feature', title: 'feedbackAnswerFeature' },
        { value: 'cool', title: 'feedbackAnswerCool' },
        { value: 'other', title: 'feedbackAnswerOther' }
      ]
    }), 'body');
  }
});
