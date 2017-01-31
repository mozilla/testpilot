/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

// @flow

import { uuid } from 'sdk/util/uuid';
import type { Action } from 'testpilot/types';

const newUUID = uuid().toString().slice(1, -1);
export function reducer(state: string = newUUID, action: Action) {
  return state;
}
