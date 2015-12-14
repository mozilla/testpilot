/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
*/

const {Cu} = require('chrome');
const request = Cu.import('resource://gre/modules/Http.jsm').httpRequest;
const getCookiesFromHost = require('./cookie-manager');

function pingServer(config, title, data, addon) {
  getCookiesFromHost(config.HOSTNAME, function(cookies) {
    let cookie = '';
    const headers = [['Accept', 'application/json'],
                     ['Content-Type', 'application/json']];
    cookies.forEach(function(c) {
      cookie += c.name + '=' + c.value + ';';
      if (c.name === 'csrftoken') {
        headers.push(['X-CSRFToken', c.value]);
      }
    });

    headers.push(['Cookie', cookie]);

    getMe(headers, config.BASE_URL, function(responseText) {
      const response = JSON.parse(responseText);
      let id = '';
      if (response.json) {
        id = response.json.id;
      }

      request(config.BASE_URL + '/api/metrics/?format=json', {
        postData: JSON.stringify(formatEvent(config.IDEATOWN_PREFIX, title, id, data, addon)),
        headers: headers,
        onLoad: function() {
          // console.error(resp);
        }
      });
    });
  });
}

function getMe(headers, BASE_URL, cb) {
  request(BASE_URL + '/api/me?format=json', {
    headers: headers,
    onLoad: cb
  });
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
