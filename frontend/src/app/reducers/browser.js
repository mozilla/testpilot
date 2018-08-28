// @flow
import config from "../config";
import { isFirefox, isMinFirefoxVersion, isMobile } from "../lib/utils";

export type BrowserState = {
  isFirefox: boolean,
  isMinFirefox: boolean,
  isMobile: boolean,
  isDev: boolean,
  locale: string,
  countryCode: string
};

function defaultState(): BrowserState {
  if (typeof navigator === "undefined") {
    return {
      userAgent: "",
      isFirefox: true,
      isMinFirefox: true,
      isMobile: false,
      isDev: config.isDev,
      locale: "en-US",
      countryCode: null
    };
  }
  const userAgent = navigator.userAgent.toLowerCase();
  return {
    userAgent,
    isFirefox: isFirefox(userAgent),
    isMinFirefox: isMinFirefoxVersion(userAgent, config.minFirefoxVersion),
    isMobile: isMobile(userAgent),
    host: window.location.host,
    protocol: window.location.protocol,
    // $FlowFixMe
    hasAddonManager: (typeof navigator.mozAddonManager !== "undefined"),
    isProdHost: window.location.host === config.prodHost,
    isDevHost: config.devHosts.includes(window.location.host),
    isDev: config.isDev,
    locale: (navigator.language || "").split("-")[0],
    countryCode: null
  };
}

export type SetStateAction = {
  type: 'SET_STATE',
  payload: BrowserState
};

export type FetchCountryCodeAction {
  type: "FETCH_COUNTRY_CODE",
  payload: String
};

export default function browserReducer(state: BrowserState, action: SetStateAction | FetchCountryCodeAction): BrowserState {
  if (state === undefined) {
    return defaultState();
  }
  switch (action.type) {
    case "SET_STATE":
      return action.payload;
    case "FETCH_COUNTRY_CODE":
      return Object.assign({}, state, {countryCode: action.payload});
    default:
      return state;
  }
}

