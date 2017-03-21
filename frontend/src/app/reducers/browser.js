// @flow


import config from '../config';
import { isFirefox, isMinFirefoxVersion, isMobile } from '../lib/utils';

const userAgent = navigator.userAgent.toLowerCase();
const isUserAgentFirefox = isFirefox(userAgent);
const isUserAgentMobile = isMobile(userAgent);
const isUserAgentMinFirefox = isMinFirefoxVersion(userAgent, config.minFirefoxVersion);
const locale = (navigator.language || '').split('-')[0];

export type BrowserState = {
  isFirefox: boolean,
  isMinFirefox: boolean,
  isMobile: boolean,
  isDev: boolean,
  locale: string
};

function defaultState(): BrowserState {
  return {
    isFirefox: isUserAgentFirefox,
    isMinFirefox: isUserAgentMinFirefox,
    isMobile: isUserAgentMobile,
    isDev: config.isDev,
    locale
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
