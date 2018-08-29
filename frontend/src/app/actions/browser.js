// @flow

import type {
  FetchCountryCodeAction
} from "../reducers/browser";

// There may be a better place for this, but this seems
// the best for now.
export const acceptedSMSCountries = ["US", "DE", "FR"];
export const COUNTRY_CODE_ENDPOINT = "https://location.services.mozilla.com/v1/country";

export function fetchCountryCode(): Promise<FetchCountryCodeAction> {
  return fetch(COUNTRY_CODE_ENDPOINT)
    .then((resp) => resp.json())
    .then((data) => {
      return {
        type: "FETCH_COUNTRY_CODE",
        payload: data.country_code
      };
    }).catch((err) => {
      return {
        type: "FETCH_COUNTRY_CODE",
        payload: ""
      };
    });
}
