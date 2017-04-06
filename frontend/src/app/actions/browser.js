
// @flow

import type {
  BrowserState,
  SetStateAction
} from '../reducers/browser';

function setState(payload: BrowserState): SetStateAction {
  return {
    type: 'SET_STATE',
    payload: payload
  };
}

export default {
  setState
};
