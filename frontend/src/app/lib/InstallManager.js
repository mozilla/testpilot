
import * as moz from './moz';
import * as addon from './addon';

function hasMozAddonManager() {
  // If we are being rendered at build time, we can't know if the client will
  // have mozAddonManager.
  if (typeof navigator === 'undefined') {
    return false;
  }
  return !!navigator.mozAddonManager;
}

const manager = hasMozAddonManager() ? moz : addon;
// TODO metric for counting number with/without moz

export function installAddon(...args) {
  return manager.installAddon(...args);
}

export function uninstallAddon() {
  return manager.uninstallAddon();
}

export function setupAddonConnection(...args) {
  if (hasMozAddonManager()) {
    addon.listen(...args);
    addon.pollAddon();
  }
  return manager.setupAddonConnection(...args);
}

export function enableExperiment(...args) {
  return manager.enableExperiment(...args);
}

export function disableExperiment(...args) {
  return manager.disableExperiment(...args);
}

export function pollAddon() {
  return addon.pollAddon();
}
