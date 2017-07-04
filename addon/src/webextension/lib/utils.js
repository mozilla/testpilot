/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/* global browser */

export const debug = process.env.NODE_ENV === 'development';

export function log(...args) {
  if (!debug) return;

  // eslint-disable-next-line no-console
  console.log(...['[TESTPILOT v2] (background)'].concat(args));
}
