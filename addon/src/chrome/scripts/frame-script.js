/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the "License"). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

/* global content, addEventListener, removeEventListener, addMessageListener, removeMessageListener, sendSyncMessage */
const debug = process.env.NODE_ENV === 'development';
const ADDON_ID = '@testpilot-addon';
const NAVIGATOR_PROPERTY_NAMES = [
  'testpilotAddon',
  'testpilotAddonVersion',
  'testpilotClientUUID'
];

const properties = {
  debug: true,
  clientUUID: null,
  currentEnvironment: null,
  addonMetadata: null
};

function init() {
  try {
    getProperties();
    addEventListener('DOMWindowCreated', handleDOMWindowCreated);
    addEventListener('unload', handleDisable);
    addMessageListener(`${ADDON_ID}:update`, handleUpdate);
    addMessageListener(`${ADDON_ID}:disable`, handleDisable);
    log('init');
  } catch (err) {
    log('init error', err);
  }
}

function handleDisable() {
  clearNavigatorProperties();
  removeEventListener('DOMWindowCreated', handleDOMWindowCreated);
  removeEventListener('unload', handleDisable);
  removeMessageListener(`${ADDON_ID}:update`, handleUpdate);
  removeMessageListener(`${ADDON_ID}:disable`, handleDisable);
  log('disable');
}

function handleDOMWindowCreated() {
  getProperties();
  log('created');
}

function handleUpdate(message) {
  Object.assign(properties, message.data);
  setNavigatorProperties();
  log('update');
}

function getProperties() {
  const result = sendSyncMessage('@testpilot-addon:getProperies');
  Object.assign(properties, result[0]);
  setNavigatorProperties();
}

function clearNavigatorProperties() {
  NAVIGATOR_PROPERTY_NAMES.forEach(
    key => delete content.wrappedJSObject.navigator[key]
  );
}

function setNavigatorProperties() {
  const { clientUUID, currentEnvironment, addonMetadata } = properties;
  if (!currentEnvironment || !clientUUID || !addonMetadata) return;

  const navigatorProps = {};

  const isTestPilot = startsWithBaseUrl(currentEnvironment.baseUrl);
  const isWhiteListed = currentEnvironment.whitelist
    .split(',')
    .filter(startsWithBaseUrl).length;

  if (isTestPilot || isWhiteListed) {
    Object.assign(navigatorProps, {
      testpilotAddon: true,
      testpilotAddonVersion: addonMetadata.version
    });
  }

  if (isTestPilot) {
    navigatorProps.testpilotClientUUID = clientUUID;
  }

  clearNavigatorProperties();
  log('setNavigatorProperties', navigatorProps);
  Object.assign(content.wrappedJSObject.navigator, navigatorProps);
}

function startsWithBaseUrl(baseUrl) {
  return content.location.href.indexOf(baseUrl) === 0;
}

init();

export function log(...args) {
  if (!debug) return;
  // eslint-disable-next-line no-console
  const c = typeof content.console !== 'undefined' ? content.console : console;
  c.log(
    ...['[TESTPILOT v2]', '(frame-script)', content.location.href].concat(args)
  );
}
