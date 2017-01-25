/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

// @flow

import chrome from 'chrome';
import { when } from 'sdk/system/unload';

function newURI(uriStr, base) {
  const ios = chrome.Cc['@mozilla.org/network/io-service;1'].getService(
    chrome.Ci.nsIIOService
  );
  try {
    const baseURI = base ? ios.newURI(base, null, null) : null;
    return ios.newURI(uriStr, null, baseURI);
  } catch (e) {
    if (e.result === chrome.Cr.NS_ERROR_MALFORMED_URI) {
      throw new Error('malformed URI: ' + uriStr);
    } else if (
      e.result === chrome.Cr.NS_ERROR_FAILURE ||
        e.result === chrome.Cr.NS_ERROR_ILLEGAL_VALUE
    ) {
      throw new Error('invalid URI: ' + uriStr);
    }
  }
  return null;
}

export function removeXULStylesheet(url: string) {
  const uri = newURI(url);
  const sss = chrome.Cc['@mozilla.org/content/style-sheet-service;1'].getService(
    chrome.Ci.nsIStyleSheetService
  );
  if (sss.sheetRegistered(uri, sss.AGENT_SHEET)) {
    sss.unregisterSheet(uri, sss.AGENT_SHEET);
  }
  return false;
}

export function addXULStylesheet(url: string) {
  const uri = newURI(url);
  const sss = chrome.Cc['@mozilla.org/content/style-sheet-service;1'].getService(
    chrome.Ci.nsIStyleSheetService
  );
  sss.loadAndRegisterSheet(uri, sss.AGENT_SHEET);
  // auto unload just in case
  when(function() {
    removeXULStylesheet(url);
  });
  return true;
}
