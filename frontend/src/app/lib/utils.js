import querystring from "querystring";

import { experimentL10nId, l10nId, l10nIdFormat, lookup } from "../../../tasks/util";

export const basketUrl = "https://basket.mozilla.org/news/subscribe/";
export const basketSMSUrl = "https://basket.mozilla.org/news/subscribe_sms/";
export const COUNTRY_CODE_ENDPOINT = "https://location.services.mozilla.com/v1/country";
// "https://www.mozilla.org/country-code.json";

export function subscribeToBasket(email, source, msgId = "test-pilot") {
  const sourceUrl = source || "https://testpilot.firefox.com/";
  return fetch(basketUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `newsletters=${msgId}&email=${encodeURIComponent(email)}&source_url=${encodeURIComponent(sourceUrl)}`
  });
}

export const acceptedSMSCountries = ["US", "DE", "FR"];

export function subscribeToBasketSMS(number, country, msgId) {
  let lang = (country === "US") ? "en" : country.toLowerCase();
  return fetch(basketSMSUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `mobile_number=${encodeURIComponent(number)}&country=${country}&lang=${lang}&msg_name=${msgId}`
  });
}

export function fetchCountryCode(onSuccess, onError) {
  return fetch(COUNTRY_CODE_ENDPOINT);
}

export function formatDate(date) {
  let out = "";
  const d = new Date(date);
  if (isNaN(d)) {
    out = null;
  } else {
    // safari is the new IE :(
    try {
      out = d.toLocaleDateString(navigator.language);
    } catch (e) {
      out = `${d.getMonth() + 1} / ${d.getDate()} / ${d.getFullYear()}`;
    }
  }
  return out;
}

export function buildSurveyURL(ref, title, installed, clientUUID, survey_url) {
  const queryParams = querystring.stringify({
    ref,
    experiment: title,
    cid: clientUUID,
    installed: installed ? Object.keys(installed) : []
  });
  return `${survey_url}?${queryParams}`;
}

export function isFirefox(ua) {
  const userAgent = ua.toLowerCase();
  return userAgent.indexOf("firefox") > -1 && userAgent.indexOf("fxios") === -1;
}

export function isMinFirefoxVersion(ua, minVersion) {
  return isFirefox(ua) && parseInt(ua.split("/").pop(), 10) >= minVersion;
}

export function isMobile(ua) {
  return ua.indexOf("mobi") > -1 || ua.indexOf("tablet") > -1;
}

// Passed a string, returns a verison of that string sanitized by stripping all
// non-alphanumeric characters, lowercasing the entire string, then capitalizing
// the first character.
//
// > l10nIdFormat('Activity Stream');
// Activitystream
export { l10nIdFormat };


// Passed an array of pieces, returns a formatted l10n ID comprised of those
// pieces, sanitized and camel-cased.
//
// > l10nId(['Activity Stream', 'Contributor', 'Title', 'Bryan Bell']);
// 'activitystreamContributorTitleBryanbell'
export { l10nId };


// Passed three pieces of information, generates and returns an appropriate l10n
// ID.
//
// Params:
// - experiment - the JavaScript object representing the experiment.
// - pieces - an array of segments used for two purposes:
//            1) to construct the generated l10n ID
//            2) to search for an _l10n suffix for the field.
//            If a string is passed, it's converted to a single-item array.
export { experimentL10nId };


// Passed an object and a period.delimited string indicating a path, returns the
// value at that path if it exists, or null if it doesn't.
//
// >> lookup({ foo: [ { bar: 'baz' } ] }, 'foo.0.bar');
// 'baz'
//
// >> lookup({}, 'foo');
// null
export { lookup };

// Returns true if the passed event is a click event that ocurred while the user
// was ctrl/cmd-clicking or middle-clicking, indicating that that they performed
// the action expecting the link to open in a new tab.
export const shouldOpenInNewTab = (e: Object) => {
  if (!e) { return false; }
  if (e.type === "click" && e.button === 1) {
    // middle-click
    return true;
  }
  return e.ctrlKey || e.metaKey;
};
