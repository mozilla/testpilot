/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

export const debug = process.env.NODE_ENV === 'development';

export const addonMetadata = {};

export function setAddonMetadata({ id, version }) {
  Object.assign(addonMetadata, { id, version });
}

export function log(...args) {
  if (!debug) return;
  // eslint-disable-next-line no-console
  console.log(...['[TESTPILOT v2] (bootstrap)'].concat(args));
}
