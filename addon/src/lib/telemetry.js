/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/* global Components, Services, TelemetryController, TelemetryEnvironment, ClientID, ADDON_INSTALL, ADDON_ENABLE, ADDON_UNINSTALL, ADDON_DISABLE */

import { log } from './utils';
import { getLegacyStorage } from './legacyStorage';
import { registerWebExtensionAPI } from './webExtension';
import { submitMainPing } from './pings';

const { utils: Cu } = Components;
Cu.import('resource://gre/modules/Services.jsm');
Cu.import('resource://gre/modules/TelemetryController.jsm');
Cu.import('resource://gre/modules/TelemetryEnvironment.jsm');
Cu.import('resource://gre/modules/ClientID.jsm');

const TELEMETRY_PREFS = [
  'toolkit.telemetry.enabled',
  'datareporting.healthreport.uploadEnabled',
  'beacon.enabled'
];

const prefs = Services.prefs;

let addonMetadata = {};
let clientUUID = '';

export function startupTelemetry(data, reason) {
  log('startupTelemetry');
  addonMetadata = data;
  registerWebExtensionAPI('getTelemetryEnvironment', getTelemetryEnvironment);
  registerWebExtensionAPI('getCachedClientID', getCachedClientID);
  registerWebExtensionAPI('submitExternalPing', submitExternalPing);
  registerWebExtensionAPI('updateClientUUID', message => clientUUID = message);
  if (reason === ADDON_INSTALL || reason === ADDON_ENABLE) {
    backupAndSetPrefs();
    submitPing(data.id, 'enabled');
  }
}

export function shutdownTelemetry(data, reason) {
  log('shutdownTelemetry');
  switch (reason) {
    case ADDON_UNINSTALL:
      submitPing(data.id, 'disabled');
      restorePrefs();
      break;
    case ADDON_DISABLE:
      submitPing(data.id, 'disabled');
      restorePrefs();
      break;
    default:
    /* no-op */
  }
}

function backupAndSetPrefs() {
  const legacyStorage = getLegacyStorage() || {};
  const legacyOriginalPrefs = {};
  if (legacyStorage.originalPrefs) {
    legacyStorage.originalPrefs.forEach(([k, v]) => legacyOriginalPrefs[k] = v);
  }

  TELEMETRY_PREFS.forEach(name => {
    // Skip backup for any existing backup prefs
    const backupName = `testpilot.backup.${name}`;
    const hasBackup = prefs.getPrefType(backupName) !== 0;
    if (hasBackup) {
      log('backup pref exists', backupName);
    } else if (typeof legacyOriginalPrefs[name] !== 'undefined') {
      // Migrate pref values from the legacy addon storage
      log('migrate backup pref', backupName);
      prefs.setBoolPref(backupName, legacyOriginalPrefs[name]);
    } else {
      // Backup any existing pref values, lacking legacy migration
      log('backup pref', backupName);
      const hasOrig = prefs.getPrefType(name) !== 0;
      if (hasOrig) {
        const origValue = prefs.getBoolPref(name);
        prefs.setBoolPref(backupName, origValue);
      }
    }
    // Finally, enable the pref after taking care of the backup.
    prefs.setBoolPref(name, true);
  });
}

function restorePrefs() {
  TELEMETRY_PREFS.forEach(name => {
    const backupName = `testpilot.backup.${name}`;
    const hasBackup = prefs.prefHasUserValue(backupName);
    if (hasBackup) {
      const backupValue = prefs.getBoolPref(backupName);
      log('restore pref', backupName, '=>', name, backupValue);
      // Restore the pref, get rid of the backup
      prefs.setBoolPref(name, backupValue);
      prefs.clearUserPref(backupName);
    }
  });
}

export function getTelemetryEnvironment() {
  return TelemetryEnvironment.currentEnvironment;
}

export function getCachedClientID() {
  return ClientID.getCachedClientID();
}

export function submitExternalPing({ topic, payload }) {
  log('submitExternalPing', topic, payload);
  TelemetryController.submitExternalPing(topic, payload, {
    addClientId: true,
    addEnvironment: true
  });
}

// HACK: On disable/shutdown it's too late to send messages to the WebExtension
// to trigger pings managed there. So, we have to do some here.
async function submitPing(object, event, time) {
  const { Headers, URLSearchParams } = Services.appShell.hiddenDOMWindow;
  return submitMainPing(
    log,
    addonMetadata,
    clientUUID,
    ClientID.getCachedClientID(),
    submitExternalPing,
    TelemetryEnvironment.currentEnvironment,
    (...args) => Services.appShell.hiddenDOMWindow.fetch(...args),
    Headers,
    URLSearchParams,
    object,
    event,
    time
  );
}
