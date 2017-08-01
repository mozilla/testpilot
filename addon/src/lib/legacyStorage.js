/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/* global Components, Services */

import { log } from './utils';
import { registerWebExtensionAPI } from './webExtension';

const { interfaces: Ci, utils: Cu } = Components;

let legacyStorage = {};

export async function startupLegacyStorage() {
  log('startupLegacyStorage');
  registerWebExtensionAPI('getLegacyStorage', () => legacyStorage);
  return readLegacyStorage();
}

export function shutdownLegacyStorage() {
  log('shutdownLegacyStorage');
}

export function getLegacyStorage() {
  return legacyStorage;
}

// TODO: Would be nice to defer this to happen on-demand if/when the
// WebExtension asks for this data. But, sendReply() in message handling doesn't
// seem amenable to async / promises - the reply data never makes it through
export async function readLegacyStorage() {
  log('readLegacyStorage');
  const { TextDecoder, OS } = Cu.import(
    'resource://gre/modules/osfile.jsm',
    {}
  );
  // Stolen from sdk/simple-storage.js
  const storeFile = Services.dirsvc.get('ProfD', Ci.nsIFile);
  [
    'jetpack',
    '@testpilot-addon',
    'simple-storage',
    'store.json'
  ].forEach(part => storeFile.append(part));

  try {
    const raw = await OS.File.read(storeFile.path);
    const txt = new TextDecoder().decode(raw);
    legacyStorage = JSON.parse(txt);
    log('legacyStorage read', legacyStorage);
  } catch (e) {
    legacyStorage = null;
    log('legacyStorage err', e);
  }
}
