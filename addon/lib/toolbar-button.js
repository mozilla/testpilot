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
}

function getExperimentList(availableExperiments, installedAddons) {
  return Mustache.render(templates.experimentList, {
    base_url: settings.BASE_URL,
    view_all_params: getParams('view-all-experiments'),
    experiments: Object.keys(availableExperiments).map(k => {
      if (installedAddons[k]) {
        availableExperiments[k].active = installedAddons[k].active;
      }
      availableExperiments[k].params = getParams(availableExperiments[k].title);
      return availableExperiments[k];
    })
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

  const experimentCount = ('availableExperiments' in store) ?
    Object.keys(store.availableExperiments).length : 0;
  panel.show({
    width: PANEL_WIDTH,
    height: (experimentCount * EXPERIMENT_HEIGHT) + FOOTER_HEIGHT,
    position: button
  });

  // TODO: Record metrics event here, along with badge context
}

module.exports = {

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

  get button() {
    return button;
  }

};
