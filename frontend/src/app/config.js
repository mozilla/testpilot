const defaultConfig = {
  isDev: true,
  minFirefoxVersion: 49,
  experimentsURL: '/api/experiments.json',
  usageCountsURL: 'https://analysis-output.telemetry.mozilla.org/testpilot/data/installation-counts/latest.json',
  ravenPublicDSN: 'https://5ceef9a20a6e4cdd93cc9a935be78c73@sentry.prod.mozaws.net/169'
};

const hostname = (typeof window === 'undefined') ? '' : window.location.hostname;

const hostConfig = {
  'testpilot.firefox.com': {
    isDev: false,
    ravenPublicDSN: 'https://51e23d7263e348a7a3b90a5357c61cb2@sentry.prod.mozaws.net/168'
  },
  'testpilot.stage.mozaws.net': {
    isDev: false,
    ravenPublicDSN: 'https://5aa2b40919a64763b32e1bca6e40b322@sentry.prod.mozaws.net/171'
  }
};

export default Object.assign({}, defaultConfig, hostConfig[hostname] || {});
