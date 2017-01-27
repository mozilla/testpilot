/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

// @flow

import * as actions from '../actions';

import type { Action, AddonState } from 'testpilot/types';

export function reducer(state: Object = {}, { payload, type }: Action) {
  let id, rating;
  switch (type) {
    case actions.SHOW_RATING_PROMPT.type:
      id = payload.experiment.addon_id;
      rating = Object.assign({}, state[id], { [payload.interval]: true });
      return Object.assign({}, state, { [id]: rating });

    case actions.SET_RATING.type:
      id = payload.experiment.addon_id;
      rating = Object.assign({}, state[id], { rating: payload.rating });
      return Object.assign({}, state, {
        lastRated: payload.time,
        [id]: rating
      });

    default:
      return state;
  }
}

export function experimentRating(state: AddonState, id: string) {
  return state.ratings[id] || {};
}
