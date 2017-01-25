/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

// @flow

import * as actions from '../actions';
import type { Action } from 'testpilot/types';

export function reducer(state: ?string = null, { payload, type }: Action) {
  switch (type) {
    case actions.EXPERIMENTS_LOADED.type:
      return payload.baseUrl;
    default:
      return state;
  }
}
