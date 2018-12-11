let uninstallButton;

function init() {
  uninstallButton = document.getElementById("uninstall-addon");
  updateUninstallButton();
}

function updateUninstallButton() {
  detectTestPilotAddon()
    .then(function (result) {
      if (result) {
        uninstallButton.removeAttribute("disabled");
        uninstallButton.innerHTML = "Uninstall Test Pilot";
        uninstallButton.addEventListener("click", handleUninstallClick);
      } else {
        uninstallButton.setAttribute("disabled", "disabled");
        uninstallButton.innerHTML = "Test Pilot not installed";
        uninstallButton.removeEventListener("click", handleUninstallClick);
      }
    });
}

function handleUninstallClick() {
  uninstallTestPilotAddon()
    .then(function () {
      alert("Add-on uninstalled");
      updateUninstallButton();
    })
    .catch(function (err) {
      alert("Add-on uninstall failed: " + err);
    });
}

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

init();
