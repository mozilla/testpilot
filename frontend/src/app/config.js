const defaultConfig = {
  isDev: true,
  minFirefoxVersion: 58,
  experimentsURL: "/api/experiments.json",
  ravenPublicDSN:
    "https://5ceef9a20a6e4cdd93cc9a935be78c73@sentry.prod.mozaws.net/169",
  addonPath: "/static/addon/addon.xpi",
  // Main production host
  prodHost: "testpilot.firefox.com",
  // Hosts used for development purposes
  devHosts: [
    "example.com:8000",
    "testpilot.dev.mozaws.net",
    "testpilot-l10n.dev.mozaws.net",
    "testpilot.stage.mozaws.net"
  ],
  // Dev hosts for which no access to mozAddonManager is expected
  nonAddonManagerDevHosts: [
    "testpilot-l10n.dev.mozaws.net"
  ]
};

const hostname = typeof window === "undefined" ? "" : window.location.hostname;

const hostConfig = {
  "testpilot.firefox.com": {
    isDev: false,
    ravenPublicDSN:
      "https://51e23d7263e348a7a3b90a5357c61cb2@sentry.prod.mozaws.net/168",
    addonPath: "/files/@testpilot-addon/latest"
  },
  "testpilot.stage.mozaws.net": {
    isDev: false,
    ravenPublicDSN:
      "https://5aa2b40919a64763b32e1bca6e40b322@sentry.prod.mozaws.net/171"
  }
};

export default Object.assign({}, defaultConfig, hostConfig[hostname] || {});
