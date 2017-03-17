import config from '../config';
import { isFirefox, isMinFirefoxVersion, isMobile } from '../lib/utils';

const userAgent = navigator.userAgent.toLowerCase();
const isUserAgentFirefox = isFirefox(userAgent);
const isUserAgentMobile = isMobile(userAgent);
const isUserAgentMinFirefox = isMinFirefoxVersion(userAgent, config.minFirefoxVersion);
const locale = (navigator.language || '').split('-')[0];

export default function browserReducer(state, action) {
  if (state === undefined) {
    return {
      isFirefox: isUserAgentFirefox,
      isMinFirefox: isUserAgentMinFirefox,
      isMobile: isUserAgentMobile,
      isDev: config.isDev,
      locale
    };
  }
  switch (action.type) {
    case 'SET_STATE':
      return action.payload;
    default:
      return state;
  }
}
