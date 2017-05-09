// @flow


import config from '../config';

export type BrowserState = {
  isFirefox: boolean,
  isMinFirefox: boolean,
  isMobile: boolean,
  isDev: boolean,
  locale: string
};

function defaultState(): BrowserState {
  return {
    userAgent: '',
    isFirefox: true,
    isMinFirefox: true,
    isMobile: false,
    isDev: config.isDev,
    locale: 'en-US'
  };
}

export type SetStateAction = {
  type: 'SET_STATE',
  payload: BrowserState
};

export default function browserReducer(state: BrowserState, action: SetStateAction): BrowserState {
  if (state === undefined) {
    return defaultState();
  }
  switch (action.type) {
    case 'SET_STATE':
      return action.payload;
    default:
      return state;
  }
}
