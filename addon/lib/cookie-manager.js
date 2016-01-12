/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the "License"). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

const {Cc, Ci} = require('chrome');
const cookieManager2 = Cc['@mozilla.org/cookiemanager;1']
                      .getService(Ci.nsICookieManager2);

function getCookiesFromHost(host, cb) {
  const cookieEnumerator = cookieManager2.getCookiesFromHost(host);
  const cookies = [];
  while (cookieEnumerator.hasMoreElements()) {
    cookies.push(cookieEnumerator.getNext().QueryInterface(Ci.nsICookie)); // eslint-disable-line new-cap
  }

  cb(cookies);
}

module.exports = getCookiesFromHost;
