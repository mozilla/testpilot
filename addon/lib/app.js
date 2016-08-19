/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

const { Class } = require('sdk/core/heritage');
const { emit, setListeners } = require('sdk/event/core');
const { EventTarget } = require('sdk/event/target');
const { PageMod } = require('sdk/page-mod');
const { Request } = require('sdk/request');
const { setInterval, clearInterval } = require('sdk/timers');

const App = Class({ // eslint-disable-line new-cap
  implements: [EventTarget],
  initialize: function(options) {
    setListeners(this, options);
    this.baseUrl = options.baseUrl;
    this.badgeColor = options.badgeColor;
    this.experiments = {};
    this.workers = new Set();
    this.reloadInterval = setInterval(
      () => this.loadExperimentList(),
      options.reloadInterval
    );

    const pageIncludes = this.baseUrl + '/*';
    this.page = new PageMod({
      include: pageIncludes,
      contentScriptFile: './message-bridge.js',
      contentScriptWhen: 'start',
      attachTo: ['top', 'existing']
    });
    this.page.on(
      'attach',
      worker => {
        this.workers.add(worker);
        worker.on('detach', () => this.workers.delete(worker));
        worker.port.on('from-web-to-addon', ev => emit(this, ev.type, ev.data));
      }
    );
    const beaconIncludes = (pageIncludes + ',' + options.whitelist).split(',');
    this.beacon = new PageMod({
      include: beaconIncludes,
      contentScriptFile: './set-installed-flag.js',
      contentScriptWhen: 'start',
      attachTo: ['top', 'existing'],
      contentScriptOptions: {
        version: options.addonVersion
      }
    });
    this.loadExperimentList();
  },
  loadExperimentList: function() {
    const r = new Request({
      headers: { 'Accept': 'application/json' },
      url: this.baseUrl + '/api/experiments.json',
      contentType: 'application/json'
    });
    r.on(
      'complete',
      res => {
        if (res.status === 200) {
          this.experiments = {};
          for (let xp of res.json.results) { // eslint-disable-line prefer-const
            this.experiments[xp.addon_id] = this.preprocessExperiment(xp);
          }
          emit(this, 'loaded', this.experiments);
        } else {
          emit(this, 'loadError', res);
        }
      }
    );
    r.get();
  },
  preprocessExperiment: function(experiment) {
    const baseUrl = this.baseUrl;
    const urlFields = {
      '': ['thumbnail', 'url', 'html_url', 'installations_url', 'survey_url'],
      details: ['image'],
      tour_steps: ['image'],
      contributors: ['avatar']
    };
    Object.keys(urlFields).forEach(key => {
      const items = (key === '') ? [experiment] : experiment[key];
      items.forEach(item => urlFields[key].forEach(field => {
        // If the URL is not absolute, prepend the environment's base URL.
        if (item[field].substr(0, 1) === '/') {
          item[field] = baseUrl + item[field];
        }
      }));
    });
    return experiment;
  },
  hasAddonID: function(id) {
    return !!this.experiments[id];
  },
  send: function(type, data) {
    for (let worker of this.workers) { // eslint-disable-line prefer-const
      worker.port.emit('from-addon-to-web', {type: type, data: data});
    }
  },
  destroy: function() {
    this.page.destroy();
    this.beacon.destroy();
    clearInterval(this.reloadInterval);
  }
});

exports.App = App;
