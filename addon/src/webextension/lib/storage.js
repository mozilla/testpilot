/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/* global browser */

import uuidv4 from 'uuid/v4';

import { log } from './utils';
import { sendBootstrapMessage } from './bootstrap';

export async function setupStorage() {
  log('setupStorage');
  const storage = browser.storage.local;

  const legacyMigrated = (await storage.get('legacyMigrated')).legacyMigrated;
  if (!legacyMigrated) {
    // Need to migrate old storage, but we'll only take a few things and flatten
    const toMigrate = { legacyMigrated: true };
    const legacyStorage = await sendBootstrapMessage('getLegacyStorage');
    if (legacyStorage) {
      const { originalPrefs } = legacyStorage;
      Object.assign(toMigrate, { originalPrefs });
      if (legacyStorage.root) {
        const { clientUUID, ratings } = legacyStorage.root;
        Object.assign(toMigrate, { clientUUID, ratings });
        if (legacyStorage.root.ui) {
          const {
            clicked,
            installTimestamp,
            shareShown
          } = legacyStorage.root.ui;
          Object.assign(toMigrate, { clicked, installTimestamp, shareShown });
        }
      }
    }
    await storage.set(toMigrate);
  }

  const data = await storage.get('clientUUID');
  if (!data.clientUUID) {
    data.clientUUID = uuidv4();
    await storage.set({ clientUUID: data.clientUUID });
  }

  sendBootstrapMessage('updateClientUUID', data.clientUUID);
  return data;
}
