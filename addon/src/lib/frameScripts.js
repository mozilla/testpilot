/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/* global Components, Services */

import { log, debug, addonMetadata } from './utils';
import { registerWebExtensionAPI } from './webExtension';

Components.utils.import('resource://gre/modules/Services.jsm');

const FRAME_SCRIPT_URL =
  'chrome://testpilot-addon-scripts/content/frame-script.js';

let currentEnvironment = null;
let clientUUID = '';

const frameScriptMessageOps = { getProperties };

function getProperties() {
  return { debug, clientUUID, currentEnvironment, addonMetadata };
}

export async function startupFrameScripts() {
  log('startupFrameScripts');

  registerWebExtensionAPI('updateClientUUID', message => {
    clientUUID = message;
    return updateFrameScripts();
  });

  registerWebExtensionAPI('updateEnvironment', message => {
    currentEnvironment = message;
    return updateFrameScripts();
  });

  Services.mm.addMessageListener(
    '@testpilot-addon:getProperies',
    getProperties
  );

  Services.mm.loadFrameScript(FRAME_SCRIPT_URL, true);

  return true;
}

export function updateFrameScripts() {
  Services.mm.broadcastAsyncMessage(
    `${addonMetadata.id}:update`,
    getProperties()
  );
}

export function shutdownFrameScripts() {
  Services.mm.broadcastAsyncMessage(`${addonMetadata.id}:disable`);
  Services.mm.removeDelayedFrameScript(FRAME_SCRIPT_URL);
  Object.keys(frameScriptMessageOps).forEach(key =>
    Services.mm.removeMessageListener(
      `${addonMetadata.id}:${key}`,
      frameScriptMessageOps[key]
    )
  );
}
