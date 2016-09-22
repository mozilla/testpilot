const defaultConfig = {
  isDev: true,
  minFirefoxVersion: 45,
  experimentsURL: '/api/experiments.json',
  usageCountsURL: 'https://analysis-output.telemetry.mozilla.org/testpilot/data/installation-counts/latest.json'
};

const hostname = (typeof window === 'undefined') ?  '' : window.location.hostname;

const hostConfig = {
  'testpilot.firefox.com': { isDev: false },
  'testpilot.stage.mozaws.net': { isDev: false }
};

export default Object.assign({}, defaultConfig, hostConfig[hostname] || {});
