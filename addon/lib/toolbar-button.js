const { ToggleButton } = require('sdk/ui/button/toggle');
const { Panel } = require('sdk/panel');
const querystring = require('sdk/querystring');
const store = require('sdk/simple-storage').storage;
const tabs = require('sdk/tabs');
const self = require('sdk/self');

const Mustache = require('mustache');
const templates = require('./templates');
Mustache.parse(templates.installed);
Mustache.parse(templates.experimentList);

const Metrics = require('./metrics');
const xulcss = require('./xulcss');
xulcss.addXULStylesheet(self.data.url('button.css'));

const PANEL_WIDTH = 300;
const FOOTER_HEIGHT = 50;
const EXPERIMENT_HEIGHT = 80;
const NEW_BADGE_LABEL = 'New';

const ONE_DAY = 24 * 60 * 60 * 1000;
const ONE_WEEK = 7 * ONE_DAY;
const NEW_EXPERIMENT_PERIOD = 2 * ONE_WEEK;

let settings;
let button;
let panel;

function getExperimentList(availableExperiments, installedAddons) {
  const now = Date.now();

  const experiments = Object.keys(availableExperiments).map(k => {
    const experiment = availableExperiments[k];
    if (installedAddons[k]) {
      experiment.active = installedAddons[k].active;
    }
    const created = (new Date(experiment.created)).getTime();
    experiment.isNew = (now - created) < NEW_EXPERIMENT_PERIOD && !experiment.active;
    experiment.params = getParams();

    if (experiment.completed) {
      const completed = (new Date(experiment.completed)).getTime();
      const delta = completed - Date.now();
      if (delta < 0) {
        experiment.eolMessage = 'Experiment Complete';
      } else if (delta < ONE_DAY) {
        experiment.eolMessage = 'Ending Tomorrow';
      } else if (delta < ONE_WEEK) {
        experiment.eolMessage = 'Ending Soon';
      }
      if (experiment.eolMessage) {
        experiment.showEol = true;
        experiment.hideActive = true;
      }
    }
    return experiment;
  });

  // Sort new experiments to the top, otherwise sort by reverse-chronological
  experiments.sort((a, b) => {
    if (a.isNew && !b.isNew) { return -1; }
    if (!a.isNew && b.isNew) { return 1; }
    return b.modified - a.modified;
  });

  return Mustache.render(templates.experimentList, {
    base_url: settings.BASE_URL,
    view_all_params: getParams('view-all-experiments'),
    experiments
  });
}

function showExperimentList() {
  panel.port.emit('show', getExperimentList(store.availableExperiments || {},
                                            store.installedAddons || {}));

  // HACK: Record toolbar button click here, so that badging state is
  // unchanged until after rendering the panel's instrumented links.
  store.toolbarButtonLastClicked = Date.now();
  ToolbarButton.updateButtonBadge(); // eslint-disable-line no-use-before-define
}

function getParams() {
  return querystring.stringify({
    utm_source: 'testpilot-addon',
    utm_medium: 'firefox-browser',
    utm_campaign: 'testpilot-doorhanger',
    utm_content: (!!button.badge) ? 'badged' : 'not badged'
  });
}

function handleButtonChange(state) {
  if (state.checked) {
    Metrics.pingTelemetry('txp_toolbar_menu_1', 'clicked', Date.now());
    const experimentCount = ('availableExperiments' in store) ?
      Object.keys(store.availableExperiments).length : 0;
    panel.show({
      width: PANEL_WIDTH,
      height: (experimentCount * EXPERIMENT_HEIGHT) + FOOTER_HEIGHT,
      position: button
    });
  }
}

const ToolbarButton = module.exports = {

  init: function(settingsIn) {
    settings = settingsIn;

    button = ToggleButton({ // eslint-disable-line new-cap
      id: 'testpilot-link',
      label: 'Test Pilot',
      icon: './transparent-16.png',
      onChange: handleButtonChange
    });

    panel = Panel({ // eslint-disable-line new-cap
      contentURL: './base.html',
      contentScriptFile: './panel.js',
      onHide: () => {
        button.state('window', {checked: false});
      }
    });

    panel.on('show', showExperimentList);
    panel.port.on('back', showExperimentList);
    panel.port.on('link', url => {
      // TODO: Record metrics event here, along with badge context
      tabs.open(url);
      panel.hide();
    });
  },

  destroy: function() {
    panel.destroy();
    button.destroy();
  },

  updateButtonBadge: function() {
    // Initialize the last button click timestamp if necessary.
    if (!('toolbarButtonLastClicked' in store)) {
      store.toolbarButtonLastClicked = Date.now();
    }

    // Look through available experiments for anything newer than the last
    // toolbar button click.
    let hasNew = false;
    if (store.availableExperiments) {
      Object.keys(store.availableExperiments).forEach(id => {
        const experiment = store.availableExperiments[id];
        const created = new Date(experiment.created);
        if (created.getTime() > store.toolbarButtonLastClicked) {
          hasNew = true;
        }
      });
    }

    // Show the button badge if there were new experiments found.
    if (hasNew) {
      // TODO: Needs l10n?
      button.badge = NEW_BADGE_LABEL;
    } else {
      button.badge = null;
    }
  },

  get button() {
    return button;
  }

};
