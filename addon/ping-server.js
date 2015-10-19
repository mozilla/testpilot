/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
*/

const prefs = require('sdk/simple-prefs').prefs;
const request = require('sdk/request').Request;
const getCookiesFromHost = require('./cookie-manager');

function pingServer(title, addon) {
  getCookiesFromHost(prefs.HOSTNAME, function(cookies) {
    const headers = {'Cookie': ''};
    cookies.forEach(function(c) {
      headers.Cookie += c.name + '=' + c.value + ';';
      if (c.name === 'csrftoken') {
        headers['X-CSRFToken'] = c.value;
      }
    });

    getMe(headers, function(response) {
      let id = '';
      if (response.json) {
        id = response.json.id;
      }

      request({
        url: prefs.BASE_URL + '/api/metrics/?format=json',
        content: formatEvent(title, id, addon),
        headers: headers,
        onComplete: function(resp) {
          console.error(resp);
        }
      }).post();
    });
  });
}

function getMe(headers, cb) {
  request({
    url: prefs.BASE_URL + '/api/me?format=json',
    headers: headers,
    onComplete: cb
  }).get();
}

function formatEvent(title, id, addon) {
  return {
    'title': 'ideatown.addon.' + title,
    'user': id,
    'experiment': {
      'id': addon.id,
      'name': addon.name,
      'version': addon.version
    }
  };
}

module.exports = pingServer;
