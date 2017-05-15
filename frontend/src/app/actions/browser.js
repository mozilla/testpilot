
// @flow

import type {
  BrowserState,
  SetStateAction
} from '../reducers/browser';

export function setState(payload: BrowserState): SetStateAction {
  return {
    type: 'SET_STATE',
    payload: payload
  };
}
