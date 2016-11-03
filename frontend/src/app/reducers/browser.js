import { handleActions } from 'redux-actions';
import config from '../config';
import { isFirefox, isMinFirefoxVersion, isMobile } from '../lib/utils';

const userAgent = navigator.userAgent.toLowerCase();
const isUserAgentFirefox = isFirefox(userAgent);
const isUserAgentMobile = isMobile(userAgent);
const isUserAgentMinFirefox = isMinFirefoxVersion(userAgent, config.minFirefoxVersion);
const locale = (navigator.language || '').split('-')[0];

export default handleActions({}, {
  isFirefox: isUserAgentFirefox,
  isMinFirefox: isUserAgentMinFirefox,
  isMobile: isUserAgentMobile,
  isDev: config.isDev,
  locale
});
