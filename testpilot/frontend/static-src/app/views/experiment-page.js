import app from 'ampersand-app';
import Model from 'ampersand-model';
import Collection from 'ampersand-collection';

import PageView from './page-view';
import DetailView from './detail-view';
import ContributorView from './contributor-view';
import template from '../templates/experiment-page';
import DisableDialogView from './disable-dialog-view';
import ExperimentListView from './experiment-list-view';
import ExperimentTourDialogView from './experiment-tour-dialog-view';
import TestpilotPromoView from './testpilot-promo-view';

function changeHeaderOn() {
  const mainHeader = document.getElementById('main-header');
  return mainHeader.clientHeight;
}

const CollectionExtended = Collection.extend({
  model: Model.extend({
    extraProperties: 'allow'
  })
});

export default PageView.extend({
  template: template,

  headerScroll: true,

  events: {
    'click [data-hook=install-experiment]': 'installExperiment',
    'click [data-hook=uninstall-experiment]': 'renderUninstallSurvey',
    'click [data-hook=feedback]': 'feedback',
    'click [data-hook=highlight-privacy]': 'highlightPrivacy'
  },

  props: {
    activeUser: {type: 'boolean', required: true, default: false}
  },

  bindings: {

    'model': [{
      hook: 'bg',
      type: function setGradientBg(el, model) {
        el.setAttribute('style',
          `background-color: ${model.gradient_start};
          background-image: linear-gradient(135deg, ${model.gradient_start}, ${model.gradient_stop}`);
        return el;
      }
    },
    // TODO: #1138 Replace this highly hackly hook so that the subtitle comes from the model
    {
      hook: 'subtitle',
      type: function removeSubtitle(el, model) {
        (model.title === 'No More 404s') ? el.textContent = 'Powered by the Wayback Machine' : '';
      }
    }],

    'model.title': {
      type: 'text',
      hook: 'title'
    },

    'model.enabled': [{
      type: 'toggle',
      yes: '[data-hook=uninstall-experiment]',
      no: '[data-hook=install-experiment]'
    },
    {
      type: 'toggle',
      hook: 'feedback'
    },
    {
      type: 'toggle',
      hook: 'highlight-privacy',
      invert: true
    }],

    'model.statusType': [{
      type: 'booleanClass',
      hook: 'has-status',
      name: 'has-status'
    },
    {
      type: 'class',
      hook: 'status-type'
    },
    {
      type: 'switch',
      cases: {
        enabled: '[data-hook=enabled-msg]',
        error: '[data-hook=error-msg]'
      }
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
      type: (el, value) => {
        el.innerHTML = value.toLocaleString();
      },
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

    'model.bug_report_url': [{
      hook: 'bug-report-url'
    },
    {
      type: 'attribute',
      name: 'href',
      hook: 'bug-report-url'
    }],

    'model.discourse_url': [{
      hook: 'discourse-url'
    },
    {
      type: 'attribute',
      name: 'href',
      hook: 'discourse-url'
    }],

    'model.introduction': [{
      type: 'innerHTML',
      hook: 'introduction-html'
    },
    {
      type: 'toggle',
      hook: 'introduction-container',
      mode: 'visibility'
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
    },

    'model.survey_url': {
      hook: 'feedback',
      type: function feedbackSurveyUrl(el) {
        el.href = this.model.buildSurveyURL('givefeedback');
      }
    },

    'activeUser': {
      type: 'toggle',
      yes: '[data-hook=active-user]',
      no: '[data-hook=inactive-user]'
    }
  },

  initialize(opts) {
    this.model = app.experiments.get(opts.slug, 'slug');

    this.didScroll = false;
    window.addEventListener('scroll', function scrollListener() {
      if (!this.didScroll && this.activeUser) {
        this.didScroll = true;
        setTimeout(this.onScroll.bind(this), 50);
      }
    }.bind(this));

    this.pageTitle = 'Test Pilot - ' + this.model.title;
    this.pageTitleL10nID = 'pageTitleExperiment';

    app.me.on('change:hasAddon', this.render, this);
  },

  render() {
    PageView.prototype.render.apply(this, arguments);

    if (!this.activeUser) {
      this.renderSubview(new TestpilotPromoView({
        isFirefox: this.isFirefox,
        parentView: this
      }), '[data-hook="testpilot-promo"]');

      this.renderSubview(new ExperimentListView({
        hasAddon: this.activeUser,
        isFirefox: this.isFirefox,
        except: this.model.slug,
        title: true
      }), '[data-hook="experiment-list"]');
    }

    app.sendToGA('pageview', {
      'dimension4': this.model.enabled,
      'dimension5': this.model.title,
      'dimension6': this.model.installation_count
    });
    this.model.updateWhenLastSeen();
    return this;
  },

  beforeRender() {
    this.activeUser = app.me.hasAddon;
    this.isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
  },

  afterRender() {
    this.renderCollection(new CollectionExtended(this.model.details),
                          DetailView,
                          this.query('.details-list'));

    this.renderCollection(new CollectionExtended(this.model.contributors),
                          ContributorView,
                          this.query('.contributors'));

    PageView.prototype.afterRender.apply(this, arguments);
  },

  remove() {
    PageView.prototype.remove.apply(this, arguments);
  },

  // isInstall is a boolean: true if we are installing, false if uninstalling
  updateAddon(isInstall, model) {
    const evtType = isInstall ? 'install-experiment' : 'uninstall-experiment';
    app.webChannel.sendMessage(evtType, {
      addon_id: model.addon_id,
      xpi_url: model.xpi_url
    });
  },

  installExperiment(evt) {
    evt.preventDefault();

    if (evt.target.disabled) { return; }
    evt.target.disabled = true;

    const width = evt.target.offsetWidth;
    evt.target.style.width = width + 'px';
    evt.target.classList.add('state-change');
    this.model.error = false;

    function cleanup() {
      evt.target.disabled = false;
      evt.target.classList.remove('state-change');
      app.off('webChannel:addon-install:download-failed');
      app.off('webChannel:addon-install:install-failed');
      app.off('webChannel:addon-install:install-ended');
    }

    app.once('webChannel:addon-install:install-failed', () => {
      this.model.error = true;
      this.model.enabled = false;
      cleanup();
    });

    app.once('webChannel:addon-install:download-failed', () => {
      this.model.error = true;
      this.model.enabled = false;
      cleanup();
    });

    // TODO: Should this maybe be an event listener at a global level?
    app.once('webChannel:addon-install:install-ended', () => {
      this.model.enabled = true;
      cleanup();
      this.model.set('installation_count', this.model.installation_count + 1);
      this.model.fetch();
      this.renderSubview(new ExperimentTourDialogView({
        model: this.model
      }), 'body');
    });
    this.updateAddon(true, this.model);
    app.sendToGA('event', {
      eventCategory: 'ExperimentDetailsPage Interactions',
      eventAction: 'button click',
      eventLabel: 'Enable Experiment'
    });
  },

  uninstallExperiment(evt) {
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

    app.sendToGA('event', {
      eventCategory: 'ExperimentDetailsPage Interactions',
      eventAction: 'button click',
      eventLabel: 'Disable Experiment'
    });

    this.uninstallExperiment(evt);

    this.renderSubview(new DisableDialogView({
      id: 'disabled-feedback',
      experiment: this.model.url,
      title: 'feedbackUninstallTitle',
      surveyUrl: this.model.buildSurveyURL('disable')
    }), 'body');
  },

  highlightPrivacy(evt) {
    evt.preventDefault();
    const measurementPanel = this.query('.measurements');
    const windowHeader = this.query('.details-header-wrapper');

    window.scrollTo(0, measurementPanel.offsetTop + changeHeaderOn());
    windowHeader.classList.add('stick');
    measurementPanel.classList.add('highlight');
    setTimeout(() => {
      measurementPanel.classList.remove('highlight');
    }, 5000);
  },


  onScroll() {
    const sy = window.pageYOffset || document.documentElement.scrollTop;

    if (sy > changeHeaderOn() - 1) {
      const header = this.query('.details-header-wrapper');
      header.classList.add('stick');
      this.query('.sticky-header-sibling').style.height = `${header.clientHeight}px`;
    } else {
      this.query('.details-header-wrapper').classList.remove('stick');
      this.query('.sticky-header-sibling').style.height = '0px';
    }

    this.didScroll = false;
  },

  feedback() {
    // Survey link is opened via href link in the template
    app.sendToGA('event', {
      eventCategory: 'ExperimentDetailsPage Interactions',
      eventAction: 'button click',
      eventLabel: 'Give Feedback'
    });
  }
});
