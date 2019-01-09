function detectTestPilotAddon() {
  return getAddonManager()
    .then(function (mam) {
      const addonId = getAddonId();
      console.log("Attempting to uninstall", addonId);
      return mam.getAddonByID(addonId);
    })
    .then(function (addon) {
      return !!addon;
    })
    .catch(function (err) {
      return false;
    });
}

function uninstallTestPilotAddon() {
  return getAddonManager()
    .then(function (mam) {
      const addonId = getAddonId();
      console.log("Attempting to uninstall", addonId);
      return mam.getAddonByID(getAddonId())
    })
    .then(function (addon) {
      return !addon
        ? Promise.reject("add-on not installed")
        : addon.uninstall();
    });
}

function getAddonManager() {
  let mam = null;
  if (typeof navigator !== "undefined") {
    mam = navigator.mozAddonManager;
  }
  return !mam
    ? Promise.reject("mozAddonManager unavailable")
    : Promise.resolve(mam);
}

function getAddonId() {
  return {
    "example.com:8000": "@testpilot-addon-local",
    "testpilot.dev.mozaws.net": "@testpilot-addon-dev",
    "testpilot-l10n.dev.mozaws.net": "@testpilot-addon-l10n",
    "testpilot.stage.mozaws.net": "@testpilot-addon-stage",
    "testpilot.firefox.com": "@testpilot-addon"
  }[window.location.host];
}

(function() {
    detectTestPilotAddon()
    .then(function (result) {
      if (result) {
        uninstallTestPilotAddon()
          .then(function () {
            console.log("txp successfully uninstalled")
          })
          .catch(function (err) {
            console.log("txp uninstall failed: " + err);
          });
      } else {
        console.log("txp not installed");
      }
    });
})();
