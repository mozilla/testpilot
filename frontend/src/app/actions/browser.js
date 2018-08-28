// @flow

import type {
  FetchCountryCodeAction
} from "../reducers/browser";

export function fetchCountryCode(): FetchCountryCodeAction {
  return fetch("url here").then((result) {
    return {
      type: "FETCH_COUNTRY_CODE",
      payload: "country code here"
    };
  });
}
