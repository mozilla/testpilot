/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

// @flow

import * as actions from '../actions';

import type { Action } from 'testpilot/types';

const tomorrow = Date.now() + 24 * 60 * 60 * 1000;

export function reducer(
  state: Object = { lastNotified: tomorrow, nextCheck: tomorrow },
  { payload, type }: Action
) {
  switch (type) {
    case actions.SCHEDULE_NOTIFIER.type:
      return Object.assign({}, state, {
        lastNotified: payload.lastNotified,
        nextCheck: payload.nextCheck
      });
    default:
      return state;
  }
}
