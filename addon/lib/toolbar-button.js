const {Cu} = require('chrome');
const Prefs = Cu.import('resource://gre/modules/Preferences.jsm').Preferences;
const {ActionButton} = require('sdk/ui/button/action');
const {Panel} = require('sdk/panel');
const querystring = require('sdk/querystring');
const store = require('sdk/simple-storage').storage;
const tabs = require('sdk/tabs');

const Mustache = require('mustache');
const templates = require('./templates');
Mustache.parse(templates.installed);
Mustache.parse(templates.experimentList);

const PANEL_WIDTH = 300;
const FOOTER_HEIGHT = 50;
const EXPERIMENT_HEIGHT = 80;
const NEW_BADGE_LABEL = 'New';
const NEW_BADGE_COLOR = '#1996F7';

const NEW_EXPERIMENT_PERIOD = 14 * 24 * 60 * 60 * 1000; // 2 weeks

let settings;
let button;
let panel;
let collapsed;

function setActionButton(dark) {
  const iconPrefix = dark ? './icon-inverted' : './icon';

  button = ActionButton({ // eslint-disable-line new-cap
    id: 'testpilot-link',
    label: 'Test Pilot',
    icon: {
      '16': iconPrefix + '-16.png',
      '32': iconPrefix + '-32.png',
      '64': iconPrefix + '-64.png'
    },
    onClick: handleToolbarButtonClick
  });

  ToolbarButton.updateButtonBadge(); // eslint-disable-line no-use-before-define
}

function getExperimentList(availableExperiments, installedAddons) {
  const now = Date.now();

  const experiments = Object.keys(availableExperiments).map(k => {
    const experiment = availableExperiments[k];
    if (installedAddons[k]) {
      experiment.active = installedAddons[k].active;
    } else {
      const created = (new Date(experiment.created)).getTime();
      experiment.isNew = (now - created) < NEW_EXPERIMENT_PERIOD;
    }
    experiment.params = getParams(experiment.title);
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
}

function getParams(title) {
  return querystring.stringify({
    utm_source: 'testpilot-addon',
    utm_medium: 'firefox-browser',
    utm_campaign: 'testpilot-doorhanger',
    utm_content: title
  });
}

function handleToolbarButtonClick() {
  collapsed = !collapsed;
  if (panel) panel.hide();
  if (collapsed) return;

  store.toolbarButtonLastClicked = Date.now();
  ToolbarButton.updateButtonBadge(); // eslint-disable-line no-use-before-define

  const experimentCount = ('availableExperiments' in store) ?
    Object.keys(store.availableExperiments).length : 0;
  panel.show({
    width: PANEL_WIDTH,
    height: (experimentCount * EXPERIMENT_HEIGHT) + FOOTER_HEIGHT,
    position: button
  });

  // TODO: Record metrics event here, along with badge context
}

const ToolbarButton = module.exports = {

  init: function(settingsIn) {
    settings = settingsIn;

    // update the our icon for devtools themes
    Prefs.observe('devtools.theme', pref => {
      setActionButton(pref === 'dark');
    });
    setActionButton(Prefs.get('devtools.theme') === 'dark');

    collapsed = true; // collapsed state for panel
    panel = Panel({ // eslint-disable-line new-cap
      contentURL: './base.html',
      contentScriptFile: './panel.js',
      onHide: () => {
        button.state('window', {checked: false});
      }
    });

    panel.on('hide', () => collapsed = true);
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
    // Bail if we haven't initialized the button yet.
    if (!button) { return; }

    // Initialize the last button click timestamp if necessary.
    if (!('toolbarButtonLastClicked' in store)) {
      // HACK: Set this to 1 so there's a value, but one that will initially be
      // less than the current time.
      store.toolbarButtonLastClicked = 1;
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
      button.badgeColor = NEW_BADGE_COLOR;
    } else {
      button.badge = null;
    }
  },

  get button() {
    return button;
  }

};
