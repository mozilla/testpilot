/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
*/

const request = require('sdk/request').Request;
const getCookiesFromHost = require('./cookie-manager');

function pingServer(config, title, data, addon) {
  getCookiesFromHost(config.HOSTNAME, function(cookies) {
    const headers = {'Cookie': '',
                     'Accept': 'application/json',
                     'Content-Type': 'application/json'};
    cookies.forEach(function(c) {
      headers.Cookie += c.name + '=' + c.value + ';';
      if (c.name === 'csrftoken') {
        headers['X-CSRFToken'] = c.value;
      }
    });

    getMe(headers, config.BASE_URL, function(response) {
      let id = '';
      if (response.json) {
        id = response.json.id;
      }

      request({
        url: config.BASE_URL + '/api/metrics/?format=json',
        content: JSON.stringify(formatEvent(config.IDEATOWN_PREFIX, title, id, data, addon)),
        headers: headers,
        onComplete: function(resp) {
          // console.error(resp);
        }
      }).post();
    });
  });
}

function getMe(headers, BASE_URL, cb) {
  request({
    url: BASE_URL + '/api/me?format=json',
    headers: headers,
    onComplete: cb
  }).get();
}

function formatEvent(PREFIX, title, id, data, addon) {
  return {
    'title': PREFIX + title,
    'user': id,
    'experiment': {
      'id': addon.id,
      'name': addon.name,
      'version': addon.version
    },
    'event-data': data
  };
}

module.exports = pingServer;
