const {Page} = require('sdk/page-worker');
const Metrics = require('./metrics');
const simplePrefs = require('sdk/simple-prefs');

let postmessageProxyFrameWorker;

const iframeURLs = {
  local: 'http://testpilot.dev:8000/postmessage-proxy',
  dev: 'http://testpilot.dev.mozaws.net/postmessage-proxy',
  stage: 'https://testpilot.stage.mozaws.net/postmessage-proxy',
  production: 'https://testpilot.firefox.com/postmessage-proxy'
};

module.exports = {

  init: function() {
    postmessageProxyFrameWorker = Page({ // eslint-disable-line new-cap
      contentURL: './postmessageProxyFrame.html',
      contentScriptFile: './postmessageProxyFrame.js'
    });

    postmessageProxyFrameWorker.port.on('telemetryPings',
      ev => Metrics.onPostmessageProxyFramePings(ev));

    postmessageProxyFrameWorker.port.on('ready', () => this.updatePrefs());

    simplePrefs.on('SERVER_ENVIRONMENT', () => this.updatePrefs());
  },

  updatePrefs: function() {
    const envName = simplePrefs.prefs.SERVER_ENVIRONMENT;
    const src = (envName in iframeURLs) ?
      iframeURLs[envName] : iframeURLs.production;
    postmessageProxyFrameWorker.port.emit('updateIFrameSrc', src);
  },

  destroy: function() {
    postmessageProxyFrameWorker.destroy();
  }

};
